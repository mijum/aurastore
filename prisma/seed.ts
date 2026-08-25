import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, AdminRole, CouponType, ProductStatus } from '../generated/prisma/client.js';
import { INITIAL_PRODUCTS } from '../src/data/products.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required to seed AuraStore');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

const categoryImages: Record<string, string> = {
  Clothing: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
  Shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
  Accessories: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  Bags: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  Watches: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
};

async function seed() {
  const categories = [...new Set(INITIAL_PRODUCTS.map((product) => product.category))];
  const categoryIds = new Map<string, string>();

  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { slug: name.toLowerCase() },
      update: { name, active: true, image: categoryImages[name] },
      create: {
        name,
        slug: name.toLowerCase(),
        description: `Premium ${name.toLowerCase()} curated by AuraStore.`,
        image: categoryImages[name],
      },
    });
    categoryIds.set(name, category.id);
  }

  for (const [index, product] of INITIAL_PRODUCTS.entries()) {
    const categoryId = categoryIds.get(product.category);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.description.slice(0, 180),
        price: product.discountPrice ?? product.price,
        compareAtPrice: product.discountPrice ? product.price : null,
        categoryId,
        status: product.stock > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK,
        featured: product.featured ?? false,
        isNew: product.newArrival ?? false,
        rating: product.rating,
        reviewCount: product.reviewCount,
        details: product.details,
        specifications: product.specifications,
        sizes: product.sizes ?? [],
        colors: product.colors ?? [],
        tags: product.tags,
      },
      create: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: `AURA-${String(index + 1).padStart(4, '0')}`,
        description: product.description,
        shortDescription: product.description.slice(0, 180),
        price: product.discountPrice ?? product.price,
        compareAtPrice: product.discountPrice ? product.price : null,
        categoryId,
        brand: 'AuraStore Select',
        status: product.stock > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK,
        featured: product.featured ?? false,
        isNew: product.newArrival ?? false,
        rating: product.rating,
        reviewCount: product.reviewCount,
        details: product.details,
        specifications: product.specifications,
        sizes: product.sizes ?? [],
        colors: product.colors ?? [],
        tags: product.tags,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: product.images.map((url, position) => ({
        productId: product.id,
        url,
        altText: product.name,
        position,
        isPrimary: position === 0,
      })),
    });
    await prisma.inventory.upsert({
      where: { productId: product.id },
      update: { stockQuantity: product.stock, lowStockThreshold: 5 },
      create: { productId: product.id, stockQuantity: product.stock, lowStockThreshold: 5 },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.deleteMany({ where: { email: { not: adminEmail } } });
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { name: process.env.ADMIN_NAME || 'Tawhid', passwordHash, active: true },
      create: {
        name: process.env.ADMIN_NAME || 'Tawhid',
        email: adminEmail,
        passwordHash,
        role: AdminRole.SUPER_ADMIN,
      },
    });
  } else {
    console.warn('ADMIN_EMAIL/ADMIN_PASSWORD not set; initial admin was not created.');
  }

  const coupons = [
    { code: 'AURA20', type: CouponType.PERCENTAGE, value: 20 },
    { code: 'SAVE500', type: CouponType.FIXED, value: 500, minimumOrder: 3000 },
  ];
  for (const coupon of coupons) {
    await prisma.coupon.upsert({ where: { code: coupon.code }, update: coupon, create: coupon });
  }

  await prisma.shippingSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default', dhakaCityFee: 60, dhakaSubAreaFee: 80, outsideDhakaFee: 120,
      expressSurcharge: 130, freeDeliveryEnabled: true, freeDeliveryMinAmount: 5000,
      freeDeliveryMinItems: 3, freeDeliveryRequirement: 'EITHER', taxRate: 0.05,
    },
  });
}

seed()
  .then(() => console.log(`Seeded ${INITIAL_PRODUCTS.length} products and AuraStore reference data.`))
  .finally(() => prisma.$disconnect());
