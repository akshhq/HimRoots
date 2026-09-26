import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import About from "./pages/About";
import SeaBuckthorn from "./pages/SeaBuckthorn";
import Contact from "./pages/Contact";
import RefundPolicy from "./pages/RefundPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="products" element={<Shop />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="payment-failed" element={<PaymentFailed />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="contact-us" element={<Contact />} />
            <Route path="sea-buckthorn" element={<SeaBuckthorn />} />
            <Route path="about-sea-buckthorn" element={<SeaBuckthorn />} />
            <Route path="himalayan-seabuckthorn-juice" element={<SeaBuckthorn />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="cancellation-and-refund" element={<RefundPolicy />} />
            <Route path="terms" element={<TermsAndConditions />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
