import { Navigate, Route, Routes } from "react-router-dom";
import { FinalShell } from "./components/layout/FinalShell";
import { CartProvider } from "./context/CartContext.jsx";
import { FinalCartPage } from "./pages/FinalCartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { FinalHomePage } from "./pages/FinalHomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { FinalOrderSuccessPage } from "./pages/FinalOrderSuccessPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { RepaymentPreviewPage } from "./pages/RepaymentPreviewPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderRepaymentPage } from "./pages/OrderRepaymentPage";

export default function App() {
  return (
    <CartProvider>
      <FinalShell>
        <Routes>
          <Route path="/" element={<FinalHomePage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<FinalCartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/orders/:orderId/repayment"
            element={<OrderRepaymentPage />}
          />
          <Route path="/repayment-preview" element={<RepaymentPreviewPage />} />
          <Route
            path="/order-success/:orderId"
            element={<FinalOrderSuccessPage />}
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </FinalShell>
    </CartProvider>
  );
}
