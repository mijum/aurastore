import { z } from 'zod';
import { CouponType, OrderStatus, PaymentStatus, ProductStatus } from '../../generated/prisma/client.js';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const colorSchema = z.object({ name: z.string().min(1), hex: z.string().regex(/^#[0-9a-fA-F]{6}$/) });
const imageSchema = z.object({
  url: z.string().min(1),
  altText: z.string().optional(),
  position: z.number().int().nonnegative().default(0),
  isPrimary: z.boolean().default(false),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sku: z.string().trim().min(2).max(80),
  categoryId: z.string().min(1),
  description: z.string().trim().min(10),
  shortDescription: z.string().trim().max(300).optional().nullable(),
  price: z.coerce.number().positive(),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  costPrice: z.coerce.number().nonnegative().optional().nullable(),
  stock: z.coerce.number().int().nonnegative(),
  lowStockThreshold: z.coerce.number().int().nonnegative().default(5),
  brand: z.string().trim().max(120).optional().nullable(),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  details: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).default({}),
  sizes: z.array(z.string()).default([]),
  colors: z.array(colorSchema).default([]),
  tags: z.array(z.string()).default([]),
  images: z.array(imageSchema).min(1),
});

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).optional().nullable(),
  image: z.string().trim().optional().nullable(),
  active: z.boolean().default(true),
  parentId: z.string().optional().nullable(),
});

export const couponInputSchema = z.object({
  code: z.string().trim().min(2).max(40).transform((value) => value.toUpperCase()),
  type: z.nativeEnum(CouponType),
  value: z.coerce.number().positive(),
  minimumOrder: z.coerce.number().nonnegative().optional().nullable(),
  maximumDiscount: z.coerce.number().nonnegative().optional().nullable(),
  usageLimit: z.coerce.number().int().positive().optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  active: z.boolean().default(true),
});

export const shippingSettingsSchema = z.object({
  dhakaCityFee: z.coerce.number().nonnegative(),
  dhakaSubAreaFee: z.coerce.number().nonnegative(),
  outsideDhakaFee: z.coerce.number().nonnegative(),
  expressSurcharge: z.coerce.number().nonnegative(),
  freeDeliveryEnabled: z.boolean(),
  freeDeliveryMinAmount: z.coerce.number().nonnegative(),
  freeDeliveryMinItems: z.coerce.number().int().nonnegative(),
  freeDeliveryRequirement: z.enum(['EITHER', 'BOTH']),
  taxRate: z.coerce.number().min(0).max(1),
});

export const orderInputSchema = z.object({
  accountId: z.string().trim().min(1).optional(),
  accountEmail: z.string().trim().email().transform((value) => value.toLowerCase()).optional(),
  customer: z.object({
    fullName: z.string().trim().min(2),
    email: z.string().trim().email().transform((value) => value.toLowerCase()),
    phone: z.string().trim().min(8).max(20),
    streetAddress: z.string().trim().min(3),
    area: z.string().trim().min(2),
    city: z.string().trim().min(2),
    district: z.string().trim().min(2),
    postalCode: z.string().trim().min(2),
    country: z.string().trim().default('Bangladesh'),
    deliveryRegion: z.enum(['dhaka_city', 'dhaka_subarea', 'outside_dhaka']).default('dhaka_city'),
  }),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive().max(100),
    selectedSize: z.string().optional(),
    selectedColor: colorSchema.optional(),
  })).min(1),
  couponCode: z.string().trim().optional(),
  deliveryMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['cod', 'card', 'mobile_payment']),
  notes: z.string().max(1000).optional(),
});

export const orderUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  adminNotes: z.string().max(2000).optional().nullable(),
}).refine((value) => Object.keys(value).length > 0, 'At least one order field is required');
