import type { DeliveryMethod, Order, PaymentMethod, Product, ShippingSettings } from '../types';

type ApiEnvelope<T> = { success: boolean; data: T; message: string; details?: unknown };

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

let authToken = typeof window !== 'undefined' ? localStorage.getItem('aura_admin_token') || '' : '';

export const setAuthToken = (token: string | null) => {
  authToken = token || '';
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('aura_admin_token', token);
    } else {
      localStorage.removeItem('aura_admin_token');
    }
  }
};

export const getAuthToken = () => authToken;

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const isForm = init.body instanceof FormData;
  const authHeaders: Record<string, string> = {};
  if (authToken && path.startsWith('/api/admin/')) {
    authHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { ...(isForm ? {} : { 'Content-Type': 'application/json' }), ...authHeaders, ...init.headers },
  });

  if (response.status === 401 && retry && path.startsWith('/api/admin/') && !path.includes('/auth/')) {
    const refreshed = await fetch(`${API_URL}/api/admin/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: authHeaders,
    });
    if (refreshed.ok) {
      const data = (await refreshed.json().catch(() => null)) as ApiEnvelope<{ token?: string }>;
      if (data?.data?.token) setAuthToken(data.data.token);
      return request<T>(path, init, false);
    }
  }

  const payload = await response.json().catch(() => ({ success: false, message: 'The server returned an invalid response' })) as ApiEnvelope<T>;
  if (!response.ok || !payload.success) throw new ApiError(payload.message || 'Request failed', response.status, payload.details);
  return payload.data;
}

const query = (params: Record<string, string | number | boolean | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => value !== undefined && value !== '' && search.set(key, String(value)));
  const value = search.toString();
  return value ? `?${value}` : '';
};

export const publicApi = {
  products: (params: Record<string, string | number | boolean | undefined> = {}) =>
    request<{ items: Product[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/api/products${query(params)}`),
  productBySlug: (slug: string) => request<Product>(`/api/products/slug/${encodeURIComponent(slug)}`),
  categories: () => request<any[]>('/api/categories'),
  shippingSettings: () => request<ShippingSettings>('/api/shipping-settings'),
  orderHistory: (accountId: string, accountEmail: string) =>
    request<Order[]>('/api/orders/history', {
      method: 'POST', body: JSON.stringify({ accountId, accountEmail }),
    }),
  validateCoupon: (code: string, subtotal: number) =>
    request<{ code: string; discount: number; type: 'PERCENTAGE' | 'FIXED'; value: number }>('/api/coupons/validate', {
      method: 'POST', body: JSON.stringify({ code, subtotal }),
    }),
  createOrder: (payload: {
    accountId?: string;
    accountEmail?: string;
    customer: Record<string, string>;
    items: Array<{ productId: string; quantity: number; selectedSize?: string; selectedColor?: { name: string; hex: string } }>;
    couponCode?: string;
    deliveryMethod: DeliveryMethod;
    paymentMethod: PaymentMethod;
  }) => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(payload) }),
};

export const adminApi = {
  login: async (email: string, password: string) => {
    const data = await request<any>('/api/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (data?.token) setAuthToken(data.token);
    return data;
  },
  me: () => request<any>('/api/admin/auth/me'),
  logout: async () => {
    try {
      await request<void>('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },
  dashboard: () => request<any>('/api/admin/dashboard'),
  products: (params: Record<string, string | number | boolean | undefined> = {}) => request<any>(`/api/admin/products${query(params)}`),
  product: (id: string) => request<any>(`/api/admin/products/${id}`),
  createProduct: (data: unknown) => request<any>('/api/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: unknown) => request<any>(`/api/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  archiveProduct: (id: string) => request<any>(`/api/admin/products/${id}`, { method: 'DELETE' }),
  duplicateProduct: (id: string) => request<any>(`/api/admin/products/${id}/duplicate`, { method: 'POST' }),
  upload: (files: FileList | File[]) => {
    const form = new FormData();
    Array.from(files).forEach((file) => form.append('images', file));
    return request<Array<{ url: string; altText: string; position: number; isPrimary: boolean }>>('/api/admin/uploads', { method: 'POST', body: form });
  },
  categories: () => request<any[]>('/api/admin/categories'),
  createCategory: (data: unknown) => request<any>('/api/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: unknown) => request<any>(`/api/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => request<void>(`/api/admin/categories/${id}`, { method: 'DELETE' }),
  inventory: (params: Record<string, string | number | boolean | undefined> = {}) => request<any>(`/api/admin/inventory${query(params)}`),
  adjustInventory: (productId: string, data: unknown) => request<any>(`/api/admin/inventory/${productId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  orders: (params: Record<string, string | number | boolean | undefined> = {}) => request<any>(`/api/admin/orders${query(params)}`),
  order: (id: string) => request<any>(`/api/admin/orders/${id}`),
  updateOrder: (id: string, data: unknown) => request<any>(`/api/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  customers: (params: Record<string, string | number | boolean | undefined> = {}) => request<any>(`/api/admin/customers${query(params)}`),
  coupons: () => request<any[]>('/api/admin/coupons'),
  createCoupon: (data: unknown) => request<any>('/api/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id: string, data: unknown) => request<any>(`/api/admin/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id: string) => request<void>(`/api/admin/coupons/${id}`, { method: 'DELETE' }),
  shippingSettings: () => request<ShippingSettings>('/api/admin/shipping-settings'),
  updateShippingSettings: (data: ShippingSettings) => request<ShippingSettings>('/api/admin/shipping-settings', { method: 'PUT', body: JSON.stringify(data) }),
};
