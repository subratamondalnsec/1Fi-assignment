import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CartProvider } from './context/CartContext.jsx';
import { CartPage } from './pages/CartPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';

export default function App() {
  return <CartProvider><AppShell><Routes><Route path="/" element={<HomePage />} /><Route path="/products/:slug" element={<ProductDetailsPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/404" element={<NotFoundPage />} /><Route path="*" element={<Navigate to="/404" replace />} /></Routes></AppShell></CartProvider>;
}
