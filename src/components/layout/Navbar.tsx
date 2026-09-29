import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Sparkles, User } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getTotals } = useCartStore();
  const { itemsCount } = getTotals();
  const { user, profile } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Sea Buckthorn", path: "/about-sea-buckthorn" },
    { name: "Shop", path: "/shop" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black border-b border-[var(--color-border)] text-[10px] sm:text-xs text-[var(--color-muted-foreground)] py-1.5 sm:py-2 px-3 sm:px-6 text-center tracking-[0.12em] sm:tracking-[0.18em] uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-primary)] flex-shrink-0" />
        <span className="hidden sm:inline">Pure Himalayan Sea Buckthorn Formulations — Free Shipping Across India</span>
        <span className="sm:hidden">Free Shipping Across India • 100% Wild Harvested</span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-primary)] hidden sm:inline flex-shrink-0" />
      </div>

      <header
        className={`sticky top-0 w-full z-50 transition-colors duration-200 ${
          isScrolled 
            ? "bg-black/95 backdrop-blur-md shadow-xl shadow-black/50 border-b border-[var(--color-border-gold)]" 
            : "bg-black border-b border-[var(--color-border)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-1 sm:py-1.5">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Prominent Navbar Logo - ~1.5x rendered size, sitting close to top & bottom borders */}
            <div className="flex items-center">
            <Link 
              to="/" 
              aria-label="Himroots Home"
              className="flex items-center group py-0.5"
            >
              <img
                src="/images/himroots-logo.png"
                alt="Himroots Wellness"
                className="h-[68px] sm:h-[74px] md:h-[80px] lg:h-[84px] w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(223,183,108,0.25)]"
              />
            </Link>
          </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-semibold uppercase tracking-[0.2em] relative py-1 hover:text-[var(--color-primary)] ${
                      isActive ? "text-[var(--color-primary)]" : "text-gray-300"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Icons: Instagram + Account + Cart + Mobile Hamburger */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              {/* Instagram Profile */}
              <a
                href="https://www.instagram.com/himroots.wellness/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Himroots on Instagram (@himroots.wellness)"
                aria-label="Follow Himroots on Instagram"
                className="text-gray-300 hover:text-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              {/* User Account */}
              <Link
                to={user ? "/account" : "/account/login"}
                title={user ? `My Account (${profile?.full_name || user.email})` : "Sign In / Account"}
                aria-label="User Account"
                className="relative text-gray-300 hover:text-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
              >
                {user ? (
                  <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-black font-bold text-[10px] flex items-center justify-center border border-[var(--color-primary-light)] shadow-sm">
                    {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </Link>

              {/* Cart */}
              <Link 
                to="/cart" 
                aria-label="Shopping Cart"
                className="relative text-gray-300 hover:text-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {itemsCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden text-gray-300 hover:text-[var(--color-primary)] p-1 rounded-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-[var(--color-border)] px-6 py-6 flex flex-col gap-6 shadow-2xl max-h-[calc(100dvh-80px)] overflow-y-auto">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-medium uppercase tracking-[0.2em] py-2 border-b border-[var(--color-border)]/50 ${
                      isActive ? "text-[var(--color-primary)] font-bold" : "text-gray-200 hover:text-[var(--color-primary)]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Mobile Account Link */}
              <Link
                to={user ? "/account" : "/account/login"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium uppercase tracking-[0.2em] py-2 border-b border-[var(--color-border)]/50 flex items-center justify-between ${
                  location.pathname.startsWith("/account")
                    ? "text-[var(--color-primary)] font-bold"
                    : "text-gray-200 hover:text-[var(--color-primary)]"
                }`}
              >
                <span>{user ? "My Account" : "Sign In / Register"}</span>
                {user && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                    Active
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Social Link */}
            <div className="pt-2 flex items-center justify-between text-xs text-gray-400">
              <a
                href="https://www.instagram.com/himroots.wellness/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-gray-300 hover:text-[var(--color-primary)] transition-colors py-2"
              >
                <InstagramIcon className="w-5 h-5 flex-shrink-0" />
                <span className="tracking-wider">@himroots.wellness</span>
              </a>
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">HimRoots Wellness</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
