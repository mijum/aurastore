import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/ToastContainer';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { CartDrawer } from './components/layout/CartDrawer';
import { QuickViewModal } from './components/product/QuickViewModal';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminGuard, AdminLayout } from './admin/AdminLayout';
import { AdminLoginPage } from './admin/AdminLoginPage';
const DashboardPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.DashboardPage })));
const ProductsPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.ProductsPage })));
const ProductFormPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.ProductFormPage })));
const CategoriesPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.CategoriesPage })));
const OrdersPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.OrdersPage })));
const OrderDetailPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.OrderDetailPage })));
const CustomersPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.CustomersPage })));
const InventoryPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.InventoryPage })));
const CouponsPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.CouponsPage })));
const SettingsPage = React.lazy(() => import('./admin/AdminPages').then((module) => ({ default: module.SettingsPage })));
const UsersPage = React.lazy(() => import('./Users/UsersPage').then((module) => ({ default: module.UsersPage })));

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}

export function App() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) {
    return (
      <ErrorBoundary>
        <ScrollToTop />
        <ToastContainer />
        <React.Suspense fallback={<div className="min-h-screen bg-slate-950 grid place-items-center"><div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" /></div>}>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id/edit" element={<ProductFormPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderDetailPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="coupons" element={<CouponsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </React.Suspense>
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <ScrollToTop />
        <AnnouncementBar />
        <Navbar />
        <MobileNav />
        <CartDrawer />
        <QuickViewModal />
        <ToastContainer />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;

