import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import About from "./pages/About";
import SeaBuckthorn from "./pages/SeaBuckthorn";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="sea-buckthorn" element={<SeaBuckthorn />} />
          <Route path="about-sea-buckthorn" element={<SeaBuckthorn />} />
          <Route path="*" element={<div className="container py-20 text-center"><h1 className="text-3xl font-bold mb-4">404</h1><p>Page not found.</p></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
