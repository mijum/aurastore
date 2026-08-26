import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { AdminRole, Prisma, ProductStatus } from '../../../generated/prisma/client.js';
import { env } from '../config.js';
import { prisma } from '../db.js';
import { requireRole } from '../middleware/auth.js';
import { fail, ok, productDto, productInclude } from '../utils.js';
import {
  categoryInputSchema,
  couponInputSchema,
  orderUpdateSchema,
  paginationSchema,
  productInputSchema,
  shippingSettingsSchema,
} from '../validation.js';
import { shippingSettingsDto } from '../shipping.js';

export const adminRouter = Router();
adminRouter.use((req, res, next) => {
  if (req.method === 'GET') return next();
  return requireRole(AdminRole.SUPER_ADMIN, AdminRole.ADMIN)(req, res, next);
});
const uploadRoot = path.resolve(env.UPLOAD_DIR);
fs.mkdirSync(uploadRoot, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadRoot,
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)),
});

adminRouter.get('/dashboard', async (_req, res) => {
  const [orderStats, totalProducts, totalCustomers, pendingOrders, processingOrders, inventories, recentOrders, topItems] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, _count: true, where: { status: { notIn: ['CANCELLED', 'REFUNDED'] } } }),
    prisma.product.count({ where: { status: { not: ProductStatus.ARCHIVED } } }),
    prisma.customer.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: { in: ['CONFIRMED', 'PROCESSING', 'PACKED'] } } }),
    prisma.inventory.findMany({ include: { product: { select: { id: true, name: true, sku: true, slug: true } } } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 8, include: { _count: { select: { items: true } } } }),
    prisma.orderItem.groupBy({ by: ['productId', 'productName', 'productImage'], _sum: { quantity: true, totalPrice: true }, orderBy: { _sum: { quantity: 'desc' } }, take: 6 }),
  ]);
  const lowStock = inventories.filter((item) => item.stockQuantity - item.reservedQuantity <= item.lowStockThreshold && item.stockQuantity > 0);
  const outOfStock = inventories.filter((item) => item.stockQuantity - item.reservedQuantity <= 0);
  return ok(res, {
    stats: {
      totalRevenue: Number(orderStats._sum.total || 0), totalOrders: orderStats._count,
      totalProducts, totalCustomers, pendingOrders, processingOrders,
      lowStockProducts: lowStock.length, outOfStockProducts: outOfStock.length,
    },
    recentOrders: recentOrders.map((order) => ({ ...order, total: Number(order.total), itemCount: order._count.items, sequence: order.sequence.toString() })),
    lowStock: [...outOfStock, ...lowStock].slice(0, 8).map((item) => ({ ...item, availableQuantity: item.stockQuantity - item.reservedQuantity })),
    topProducts: topItems.map((item) => ({ ...item, revenue: Number(item._sum?.totalPrice || 0), quantity: item._sum?.quantity || 0 })),
  });
});

adminRouter.get('/products', async (req, res) => {
  const pagination = paginationSchema.parse(req.query);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : '';
  const status = typeof req.query.status === 'string' && Object.values(ProductStatus).includes(req.query.status as ProductStatus) ? req.query.status as ProductStatus : undefined;
  const stock = typeof req.query.stock === 'string' ? req.query.stock : '';
  const where: Prisma.ProductWhereInput = {
    ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }, { category: { name: { contains: search, mode: 'insensitive' } } }] } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(status ? { status } : {}),
    ...(stock === 'out' ? { inventory: { stockQuantity: 0 } } : stock === 'in' ? { inventory: { stockQuantity: { gt: 0 } } } : {}),
  };
  const sort = String(req.query.sort || 'newest');
  const orderBy: Prisma.ProductOrderByWithRelationInput = sort === 'oldest' ? { createdAt: 'asc' } : sort === 'price_asc' ? { price: 'asc' } : sort === 'price_desc' ? { price: 'desc' } : sort === 'name' ? { name: 'asc' } : { createdAt: 'desc' };
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, include: productInclude, orderBy, skip: (pagination.page - 1) * pagination.limit, take: pagination.limit }),
    prisma.product.count({ where }),
  ]);
  return ok(res, { items: items.map(productDto), pagination: { ...pagination, total, totalPages: Math.ceil(total / pagination.limit) } });
});

adminRouter.get('/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: productInclude });
  if (!product) return fail(res, 'Product not found', 404);
  return ok(res, productDto(product));
});

adminRouter.post('/products', async (req, res) => {
  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid product information', 422, parsed.error.flatten());
  const { stock, lowStockThreshold, images, ...data } = parsed.data;
  try {
    const product = await prisma.product.create({
      data: {
        id: randomUUID(), ...data,
        details: data.details, specifications: data.specifications, sizes: data.sizes, colors: data.colors,
        images: { create: images }, inventory: { create: { stockQuantity: stock, lowStockThreshold } },
      }, include: productInclude,
    });
    return ok(res, productDto(product), 'Product created successfully', 201);
  } catch (error) {
    return fail(res, error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002' ? 'Slug or SKU already exists' : 'Product could not be created', 409);
  }
});

adminRouter.put('/products/:id', async (req, res) => {
  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid product information', 422, parsed.error.flatten());
  const { stock, lowStockThreshold, images, ...data } = parsed.data;
  try {
    const product = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: req.params.id } });
      return tx.product.update({
        where: { id: req.params.id },
        data: {
          ...data, details: data.details, specifications: data.specifications, sizes: data.sizes, colors: data.colors,
          images: { create: images },
          inventory: { upsert: { create: { stockQuantity: stock, lowStockThreshold }, update: { stockQuantity: stock, lowStockThreshold } } },
        }, include: productInclude,
      });
    });
    return ok(res, productDto(product), 'Product updated successfully');
  } catch {
    return fail(res, 'Product could not be updated', 409);
  }
});

adminRouter.delete('/products/:id', async (req, res) => {
  const orderItems = await prisma.orderItem.count({ where: { productId: req.params.id } });
  if (orderItems > 0) {
    await prisma.product.update({ where: { id: req.params.id }, data: { status: ProductStatus.ARCHIVED } });
    return ok(res, null, 'Product archived to preserve order history');
  }
  await prisma.product.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Product deleted successfully');
});

adminRouter.post('/products/:id/duplicate', async (req, res) => {
  const source = await prisma.product.findUnique({ where: { id: req.params.id }, include: productInclude });
  if (!source) return fail(res, 'Product not found', 404);
  const suffix = Date.now().toString().slice(-6);
  const duplicate = await prisma.product.create({
    data: {
      id: crypto.randomUUID(), name: `${source.name} Copy`, slug: `${source.slug}-copy-${suffix}`, sku: `${source.sku}-C${suffix}`,
      description: source.description, shortDescription: source.shortDescription, price: source.price, compareAtPrice: source.compareAtPrice,
      costPrice: source.costPrice, categoryId: source.categoryId, brand: source.brand, status: ProductStatus.DRAFT,
      featured: false, isNew: false, isBestSeller: false, rating: source.rating, reviewCount: 0,
      details: source.details ?? Prisma.JsonNull, specifications: source.specifications ?? Prisma.JsonNull,
      sizes: source.sizes ?? Prisma.JsonNull, colors: source.colors ?? Prisma.JsonNull, tags: source.tags,
      images: { create: source.images.map((image) => ({ url: image.url, altText: image.altText, position: image.position, isPrimary: image.isPrimary })) },
      inventory: { create: { stockQuantity: 0, lowStockThreshold: source.inventory?.lowStockThreshold || 5 } },
    }, include: productInclude,
  });
  return ok(res, productDto(duplicate), 'Product duplicated', 201);
});

adminRouter.post('/uploads', upload.array('images', 8), (req, res) => {
  const files = (req.files || []) as Express.Multer.File[];
  return ok(res, files.map((file) => ({ url: `/uploads/${file.filename}`, altText: file.originalname, position: 0, isPrimary: false })), 'Images uploaded');
});

adminRouter.get('/categories', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { products: true } } } });
  return ok(res, categories.map((category) => ({ ...category, productCount: category._count.products, _count: undefined })));
});

adminRouter.post('/categories', async (req, res) => {
  const parsed = categoryInputSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid category information', 422, parsed.error.flatten());
  const category = await prisma.category.create({ data: parsed.data });
  return ok(res, category, 'Category created successfully', 201);
});

adminRouter.put('/categories/:id', async (req, res) => {
  const parsed = categoryInputSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid category information', 422, parsed.error.flatten());
  const category = await prisma.category.update({ where: { id: req.params.id }, data: parsed.data });
  return ok(res, category, 'Category updated successfully');
});

adminRouter.delete('/categories/:id', async (req, res) => {
  const productCount = await prisma.product.count({ where: { categoryId: req.params.id } });
  if (productCount > 0) return fail(res, 'Move or archive associated products before deleting this category', 409);
  await prisma.category.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Category deleted successfully');
});

adminRouter.get('/inventory', async (_req, res) => {
  const inventory = await prisma.inventory.findMany({ include: { product: { include: { images: { orderBy: { position: 'asc' }, take: 1 }, category: true } } }, orderBy: { updatedAt: 'desc' } });
  return ok(res, inventory.map((item) => ({ ...item, availableQuantity: item.stockQuantity - item.reservedQuantity })));
});

adminRouter.patch('/inventory/:productId', async (req, res) => {
  const mode = String(req.body?.mode || 'set');
  const quantity = Number(req.body?.quantity);
  if (!Number.isInteger(quantity) || (mode === 'set' && quantity < 0) || !['set', 'increase', 'decrease'].includes(mode)) return fail(res, 'Valid adjustment mode and quantity are required', 422);
  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.inventory.findUnique({ where: { productId: req.params.productId }, include: { product: true } });
    if (!current) throw new Error('Inventory not found');
    const next = mode === 'set' ? quantity : mode === 'increase' ? current.stockQuantity + Math.abs(quantity) : Math.max(0, current.stockQuantity - Math.abs(quantity));
    const inventory = await tx.inventory.update({ where: { productId: req.params.productId }, data: { stockQuantity: next } });
    await tx.inventoryAdjustment.create({ data: { productId: req.params.productId, type: mode === 'set' ? 'SET' : mode === 'increase' ? 'INCREASE' : 'DECREASE', quantity: next - current.stockQuantity, before: current.stockQuantity, after: next, reason: String(req.body?.reason || 'Admin adjustment') } });
    await tx.product.update({ where: { id: req.params.productId }, data: { status: next === 0 ? ProductStatus.OUT_OF_STOCK : current.product.status === ProductStatus.OUT_OF_STOCK ? ProductStatus.ACTIVE : current.product.status } });
    return inventory;
  });
  return ok(res, result, 'Inventory adjusted successfully');
});

adminRouter.get('/orders', async (req, res) => {
  const pagination = paginationSchema.parse(req.query);
  const search = String(req.query.search || '').trim();
  const status = String(req.query.status || '');
  const where: Prisma.OrderWhereInput = {
    ...(search ? { OR: [{ orderNumber: { contains: search, mode: 'insensitive' } }, { customerName: { contains: search, mode: 'insensitive' } }, { customerEmail: { contains: search, mode: 'insensitive' } }] } : {}),
    ...(status ? { status: status as never } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.order.findMany({ where, include: { _count: { select: { items: true } } }, orderBy: { createdAt: req.query.sort === 'oldest' ? 'asc' : 'desc' }, skip: (pagination.page - 1) * pagination.limit, take: pagination.limit }),
    prisma.order.count({ where }),
  ]);
  return ok(res, { items: items.map((order) => ({ ...order, sequence: order.sequence.toString(), subtotal: Number(order.subtotal), discount: Number(order.discount), shipping: Number(order.shipping), tax: Number(order.tax), total: Number(order.total), itemCount: order._count.items })), pagination: { ...pagination, total, totalPages: Math.ceil(total / pagination.limit) } });
});

adminRouter.get('/orders/:id', async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true, customer: true } });
  if (!order) return fail(res, 'Order not found', 404);
  return ok(res, { ...order, sequence: order.sequence.toString(), subtotal: Number(order.subtotal), discount: Number(order.discount), shipping: Number(order.shipping), tax: Number(order.tax), total: Number(order.total), items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice), totalPrice: Number(item.totalPrice) })) });
});

adminRouter.patch('/orders/:id/status', async (req, res) => {
  const parsed = orderUpdateSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid order update', 422, parsed.error.flatten());
  const order = await prisma.order.update({ where: { id: req.params.id }, data: parsed.data });
  return ok(res, { ...order, sequence: order.sequence.toString(), total: Number(order.total) }, 'Order updated successfully');
});

adminRouter.get('/customers', async (req, res) => {
  const pagination = paginationSchema.parse(req.query);
  const search = String(req.query.search || '').trim();
  const where: Prisma.CustomerWhereInput = search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }, { phone: { contains: search } }] } : {};
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({ where, include: { orders: { select: { id: true, total: true, createdAt: true, status: true }, orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' }, skip: (pagination.page - 1) * pagination.limit, take: pagination.limit }),
    prisma.customer.count({ where }),
  ]);
  return ok(res, { items: customers.map((customer) => ({ ...customer, orderCount: customer.orders.length, totalSpent: customer.orders.filter((order) => !['CANCELLED', 'REFUNDED'].includes(order.status)).reduce((sum, order) => sum + Number(order.total), 0), lastOrder: customer.orders[0]?.createdAt })), pagination: { ...pagination, total, totalPages: Math.ceil(total / pagination.limit) } });
});

adminRouter.get('/coupons', async (_req, res) => ok(res, await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })));
adminRouter.post('/coupons', async (req, res) => {
  const parsed = couponInputSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid coupon information', 422, parsed.error.flatten());
  return ok(res, await prisma.coupon.create({ data: parsed.data }), 'Coupon created successfully', 201);
});
adminRouter.put('/coupons/:id', async (req, res) => {
  const parsed = couponInputSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid coupon information', 422, parsed.error.flatten());
  return ok(res, await prisma.coupon.update({ where: { id: req.params.id }, data: parsed.data }), 'Coupon updated successfully');
});
adminRouter.delete('/coupons/:id', async (req, res) => {
  await prisma.coupon.delete({ where: { id: req.params.id } });
  return ok(res, null, 'Coupon deleted successfully');
});

adminRouter.get('/shipping-settings', async (_req, res) => {
  const settings = await prisma.shippingSettings.upsert({ where: { id: 'default' }, update: {}, create: { id: 'default' } });
  return ok(res, shippingSettingsDto(settings));
});

adminRouter.put('/shipping-settings', async (req, res) => {
  const parsed = shippingSettingsSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 'Invalid shipping settings', 422, parsed.error.flatten());
  const settings = await prisma.shippingSettings.upsert({
    where: { id: 'default' },
    update: parsed.data,
    create: { id: 'default', ...parsed.data },
  });
  return ok(res, shippingSettingsDto(settings), 'Shipping settings updated successfully');
});
