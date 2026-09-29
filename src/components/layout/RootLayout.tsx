import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Watermark } from "./Watermark";
import { CartNotificationPopup } from "@/components/cart/CartNotificationPopup";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RootLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <CartNotificationPopup />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Watermark />
    </div>
  );
}
