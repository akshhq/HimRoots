import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
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
      <div className="bg-black border-b border-[var(--color-border)] text-[10px] sm:text-xs text-[var(--color-muted-foreground)] py-1.5 sm:py-2 px-3 sm:px-6 text-center tracking-[0.14em] sm:tracking-[0.18em] uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-primary)] flex-shrink-0" />
        <span className="truncate">Pure Himalayan Sea Buckthorn Formulations — Free Shipping Across India</span>
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-primary)] hidden sm:inline flex-shrink-0" />
      </div>

      <header
        className={`sticky top-0 w-full z-50 ${
          isScrolled 
            ? "bg-black py-2.5 sm:py-3 shadow-xl shadow-black/50 border-b border-[var(--color-border-gold)]" 
            : "bg-black py-3 sm:py-4 border-b border-[var(--color-border)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* Prominent Navbar Logo - Always visible, increased size */}
            <div className="flex items-center">
              <Link 
                to="/" 
                aria-label="Himroots Home"
                className="flex items-center gap-2 group"
              >
                <BrandLogo size="md" imgClassName="h-14 sm:h-16 md:h-20 lg:h-[84px] w-auto" showSubtitle={false} />
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

            {/* Right Icons: Instagram + Cart + Mobile Hamburger */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Instagram Profile */}
              <a
                href="https://www.instagram.com/himroots.wellness/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Himroots on Instagram (@himroots.wellness)"
                aria-label="Follow Himroots on Instagram"
                className="text-gray-300 hover:text-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-secondary)]"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              {/* Cart */}
              <Link 
                to="/cart" 
                aria-label="Shopping Cart"
                className="relative text-gray-300 hover:text-[var(--color-primary)] p-1.5 rounded-full hover:bg-[var(--color-secondary)]"
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
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-[var(--color-border)] px-6 py-8 flex flex-col gap-6 shadow-2xl">
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
