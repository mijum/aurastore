import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import type { AdminUser, ProductStatus } from '../../generated/prisma/client.js';
import { env, isProduction } from './config.js';
import type { AdminClaims } from './types.js';

export const ok = <T>(res: Response, data: T, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, data, message });

export const fail = (res: Response, message: string, status = 400, details?: unknown) =>
  res.status(status).json({ success: false, message, ...(details ? { details } : {}) });

export const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export const createAccessToken = (admin: Pick<AdminUser, 'id' | 'email' | 'role'>) =>
  jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role, type: 'access' } satisfies AdminClaims,
    env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

export const createRefreshToken = (
  admin: Pick<AdminUser, 'id' | 'email' | 'role'>,
  sessionId: string
) =>
  jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role, type: 'refresh', sessionId } satisfies AdminClaims,
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const base = { httpOnly: true, secure: isProduction, sameSite: 'lax' as const, path: '/' };
  res.cookie('aura_admin_access', accessToken, { ...base, maxAge: 15 * 60 * 1000 });
  res.cookie('aura_admin_refresh', refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('aura_admin_access', { path: '/' });
  res.clearCookie('aura_admin_refresh', { path: '/' });
};

type ProductWithRelations = {
  id: string; slug: string; name: string; sku: string; description: string; shortDescription: string | null;
  price: unknown; compareAtPrice: unknown; costPrice?: unknown; brand: string | null; status: ProductStatus;
  featured: boolean; isNew: boolean; isBestSeller: boolean; rating: unknown; reviewCount: number;
  details: unknown; specifications: unknown; sizes: unknown; colors: unknown; tags: string[];
  category: { id: string; name: string; slug: string };
  images: Array<{ id: string; url: string; altText: string | null; position: number; isPrimary: boolean }>;
  inventory: { stockQuantity: number; reservedQuantity: number; lowStockThreshold: number } | null;
  createdAt: Date; updatedAt: Date;
};

export const productDto = (product: ProductWithRelations) => {
  const sellingPrice = Number(product.price);
  const compareAtPrice = product.compareAtPrice == null ? undefined : Number(product.compareAtPrice);
  const available = Math.max(0, (product.inventory?.stockQuantity || 0) - (product.inventory?.reservedQuantity || 0));
  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    category: product.category.name,
    categoryId: product.category.id,
    price: compareAtPrice ?? sellingPrice,
    discountPrice: compareAtPrice ? sellingPrice : undefined,
    costPrice: product.costPrice == null ? undefined : Number(product.costPrice),
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    description: product.description,
    shortDescription: product.shortDescription,
    details: Array.isArray(product.details) ? product.details : [],
    specifications: product.specifications && typeof product.specifications === 'object' ? product.specifications : {},
    stock: available,
    stockQuantity: product.inventory?.stockQuantity || 0,
    reservedQuantity: product.inventory?.reservedQuantity || 0,
    lowStockThreshold: product.inventory?.lowStockThreshold || 5,
    images: product.images.sort((a, b) => a.position - b.position).map((image) => image.url),
    imageRecords: product.images,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    featured: product.featured,
    newArrival: product.isNew,
    isBestSeller: product.isBestSeller,
    brand: product.brand,
    status: product.status,
    tags: product.tags,
    reviews: [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

export const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { position: 'asc' as const } },
  inventory: true,
};
