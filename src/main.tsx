import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartAnimationProvider } from './context/CartAnimationContext';
import { AdminProvider } from './admin/AdminContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <StoreProvider>
        <AdminProvider>
          <CartAnimationProvider>
            <App />
          </CartAnimationProvider>
        </AdminProvider>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
