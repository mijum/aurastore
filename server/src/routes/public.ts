import { Router } from 'express';
import { Prisma, ProductStatus, CouponType } from '../../../generated/prisma/client.js';
import { prisma } from '../db.js';
import { fail, ok, productDto, productInclude } from '../utils.js';
import { orderInputSchema, paginationSchema } from '../validation.js';
import { calculateShipping, shippingSettingsDto } from '../shipping.js';

export const publicRouter = Router();

publicRouter.get('/shipping-settings', async (_req, res) => {
  const settings = await prisma.shippingSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  return ok(res, shippingSettingsDto(settings));
});

publicRouter.get('/products', async (req, res) => {
  const pagination = paginationSchema.parse(req.query);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'featured';
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const featured = req.query.featured === 'true';
  const inStock = req.query.inStock === 'true';

  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
    ...(featured ? { featured: true } : {}),
    ...(category ? { category: { OR: [{ slug: category.toLowerCase() }, { name: { equals: category, mode: 'insensitive' } }] } } : {}),
    ...(search ? { OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ] } : {}),
    ...((minPrice != null || maxPrice != null) ? { price: { gte: minPrice, lte: maxPrice } } : {}),
    ...(inStock ? { inventory: { stockQuantity: { gt: 0 } } } : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'price_asc' || sort === 'price-asc' ? { price: 'asc' } :
    sort === 'price_desc' || sort === 'price-desc' ? { price: 'desc' } :
    sort === 'newest' ? { createdAt: 'desc' } :
    sort === 'rating' ? { rating: 'desc' } : { featured: 'desc' };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    }),
    prisma.product.count({ where }),
  ]);

  return ok(res, {
    items: items.map(productDto),
    pagination: { page: pagination.page, limit: pagination.limit, total, totalPages: Math.ceil(total / pagination.limit) },
  });
});

publicRouter.get('/products/slug/:slug', async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { slug: req.params.slug, status: ProductStatus.ACTIVE },
    include: productInclude,
  });
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, productDto(product));
});

publicRouter.get('/products/:id', async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { id: req.params.id, status: ProductStatus.ACTIVE },
    include: productInclude,
  });
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, productDto(product));
});

publicRouter.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: { where: { status: ProductStatus.ACTIVE } } } } },
  });
  return ok(res, categories.map((category) => ({ ...category, productCount: category._count.products, _count: undefined })));
});

publicRouter.get('/categories/:slug/products', async (req, res) => {
  req.query.category = req.params.slug;
  const category = await prisma.category.findUnique({ where: { slug: req.params.slug } });
  if (!category?.active) return fail(res, 'Category not found', 404);
  const products = await prisma.product.findMany({ where: { categoryId: category.id, status: ProductStatus.ACTIVE }, include: productInclude });
  return ok(res, { category, items: products.map(productDto) });
});

publicRouter.post('/coupons/validate', async (req, res) => {
  const code = String(req.body?.code || '').trim().toUpperCase();
  const subtotal = Number(req.body?.subtotal || 0);
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  const now = new Date();
  if (!coupon || !coupon.active || (coupon.startDate && coupon.startDate > now) || (coupon.endDate && coupon.endDate < now) ||
      (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) ||
      (coupon.minimumOrder != null && subtotal < Number(coupon.minimumOrder))) {
    return fail(res, 'Coupon is invalid or unavailable', 422);
  }
  let discount = coupon.type === CouponType.PERCENTAGE ? subtotal * Number(coupon.value) / 100 : Number(coupon.value);
  if (coupon.maximumDiscount != null) discount = Math.min(discount, Number(coupon.maximumDiscount));
  return ok(res, { code: coupon.code, discount: Math.min(subtotal, Math.round(discount)), type: coupon.type, value: Number(coupon.value) });
});

publicRouter.post('/orders/history', async (req, res) => {
  const accountId = String(req.body?.accountId || '').trim();
  const accountEmail = String(req.body?.accountEmail || '').trim().toLowerCase();
  if (!accountId || !accountEmail || !accountEmail.includes('@')) {
    return fail(res, 'Account identity is required', 422);
  }

  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { accountId },
        { accountEmail: { equals: accountEmail, mode: 'insensitive' } },
        { customerEmail: { equals: accountEmail, mode: 'insensitive' } },
      ],
    },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  const statusMap: Record<string, 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'> = {
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Cancelled',
  };

  return ok(res, orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt,
    userId: accountId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    deliveryMethod: order.deliveryMethod,
    paymentMethod: order.paymentMethod,
    items: order.items.map((item) => ({
      productId: item.productId || '',
      productName: item.productName,
      productImage: item.productImage || '',
      price: Number(item.unitPrice),
      quantity: item.quantity,
      selectedSize: item.selectedSize || undefined,
      selectedColor: item.selectedColor || undefined,
      total: Number(item.totalPrice),
    })),
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    shippingFee: Number(order.shipping),
    discount: Number(order.discount),
    couponCode: order.couponCode || undefined,
    total: Number(order.total),
    status: statusMap[order.status] || 'Processing',
    estimatedDelivery: order.estimatedDelivery?.toISOString().split('T')[0] || order.createdAt.toISOString().split('T')[0],
  })));
});

publicRouter.post('/orders', async (req, res) => {
  const parsed = orderInputSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid checkout information', 422, parsed.error.flatten());
  const input = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const quantities = new Map<string, number>();
      for (const item of input.items) quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
      const products = await tx.product.findMany({
        where: { id: { in: [...quantities.keys()] }, status: ProductStatus.ACTIVE },
        include: productInclude,
      });
      if (products.length !== quantities.size) throw new Error('One or more products are unavailable');

      for (const product of products) {
        const requested = quantities.get(product.id) || 0;
        const available = (product.inventory?.stockQuantity || 0) - (product.inventory?.reservedQuantity || 0);
        if (requested > available) throw new Error(`Only ${available} units of ${product.name} remain`);
      }

      const subtotal = input.items.reduce((total, item) => {
        const product = products.find((candidate) => candidate.id === item.productId)!;
        return total + Number(product.price) * item.quantity;
      }, 0);

      let discount = 0;
      let coupon = null;
      if (input.couponCode) {
        coupon = await tx.coupon.findUnique({ where: { code: input.couponCode.trim().toUpperCase() } });
        const now = new Date();
        if (!coupon || !coupon.active || (coupon.startDate && coupon.startDate > now) || (coupon.endDate && coupon.endDate < now) ||
            (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) ||
            (coupon.minimumOrder != null && subtotal < Number(coupon.minimumOrder))) throw new Error('Coupon is no longer valid');
        discount = coupon.type === CouponType.PERCENTAGE ? subtotal * Number(coupon.value) / 100 : Number(coupon.value);
        if (coupon.maximumDiscount != null) discount = Math.min(discount, Number(coupon.maximumDiscount));
        discount = Math.min(subtotal, Math.round(discount));
      }

      const settings = await tx.shippingSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
      const itemCount = input.items.reduce((sum, item) => sum + item.quantity, 0);
      const shipping = calculateShipping(settings, subtotal, itemCount, input.customer.deliveryRegion, input.deliveryMethod);
      const tax = Math.round(Math.max(0, subtotal - discount) * Number(settings.taxRate));
      const total = subtotal - discount + shipping + tax;
      const customer = await tx.customer.upsert({
        where: { email: input.customer.email },
        update: { name: input.customer.fullName, phone: input.customer.phone },
        create: { name: input.customer.fullName, email: input.customer.email, phone: input.customer.phone },
      });
      const orderNumber = `AURA-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;
      const estimated = new Date(Date.now() + (input.deliveryMethod === 'express' ? 2 : 4) * 86400000);
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          accountId: input.accountId,
          accountEmail: input.accountEmail,
          status: 'PENDING',
          paymentStatus: input.paymentMethod === 'cod' ? 'UNPAID' : 'PENDING',
          paymentMethod: input.paymentMethod,
          deliveryMethod: input.deliveryMethod,
          subtotal, discount, shipping, tax, total,
          shippingAddress: input.customer,
          customerName: input.customer.fullName,
          customerEmail: input.customer.email,
          customerPhone: input.customer.phone,
          couponCode: coupon?.code,
          notes: input.notes,
          estimatedDelivery: estimated,
          items: { create: input.items.map((item) => {
            const product = products.find((candidate) => candidate.id === item.productId)!;
            return {
              productId: product.id,
              productName: product.name,
              productSku: product.sku,
              productImage: product.images[0]?.url,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor || Prisma.JsonNull,
              quantity: item.quantity,
              unitPrice: product.price,
              totalPrice: Number(product.price) * item.quantity,
            };
          }) },
        },
        include: { items: true },
      });

      for (const product of products) {
        const quantity = quantities.get(product.id) || 0;
        const before = product.inventory!.stockQuantity;
        await tx.inventory.update({ where: { productId: product.id }, data: { stockQuantity: { decrement: quantity } } });
        await tx.inventoryAdjustment.create({ data: { productId: product.id, type: 'SALE', quantity: -quantity, before, after: before - quantity, reason: orderNumber } });
      }
      if (coupon) await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
      return order;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

    return ok(res, {
      id: result.id,
      orderNumber: result.orderNumber,
      date: result.createdAt,
      customerName: result.customerName,
      customerEmail: result.customerEmail,
      customerPhone: result.customerPhone,
      shippingAddress: result.shippingAddress,
      deliveryMethod: result.deliveryMethod,
      paymentMethod: result.paymentMethod,
      items: result.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        price: Number(item.unitPrice),
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        total: Number(item.totalPrice),
      })),
      subtotal: Number(result.subtotal), tax: Number(result.tax), shippingFee: Number(result.shipping),
      discount: Number(result.discount), couponCode: result.couponCode, total: Number(result.total),
      status: result.status, estimatedDelivery: result.estimatedDelivery?.toISOString().split('T')[0],
    }, 'Order created successfully', 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Order could not be created';
    return fail(res, message, 409);
  }
});
