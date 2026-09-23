import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, Sparkles, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getTotals } = useCartStore();
  const { itemsCount } = getTotals();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Sea Buckthorn", path: "/sea-buckthorn" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[var(--color-secondary)]/90 border-b border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)] py-1.5 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
        <span>Himalayan Sea Buckthorn Juice (500ml) — Free Shipping Across India</span>
        <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)] hidden sm:inline" />
      </div>

      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#140e0b]/90 backdrop-blur-md py-3 shadow-lg shadow-black/40 border-b border-[var(--color-border-gold)]" 
            : "bg-[#140e0b]/60 backdrop-blur-sm py-4 border-b border-[var(--color-border)]"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <BrandLogo size="sm" showSubtitle={false} />
            </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wider transition-colors hover:text-[var(--color-primary)] ${
                  location.pathname === link.path ? "text-[var(--color-primary)] font-medium" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-[var(--color-primary)] transition-colors hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-gray-300 hover:text-[var(--color-primary)] transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </button>
            <Link to="/cart" className="relative text-gray-300 hover:text-[var(--color-primary)] transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-300 hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-t border-[var(--color-border)] px-4 py-6 flex flex-col gap-6 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-lg uppercase tracking-wider ${
                location.pathname === link.path ? "text-[var(--color-primary)] font-medium" : "text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex gap-6 mt-4 border-t border-[var(--color-border)] pt-6">
            <button className="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)]">
              <Search className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Search</span>
            </button>
            <button className="flex items-center gap-2 text-gray-300 hover:text-[var(--color-primary)]">
              <User className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Account</span>
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
}

