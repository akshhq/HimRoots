import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  User,
  Package,
  MapPin,
  LogOut,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { AnnouncementBar } from "../home/AnnouncementBar";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { getTotals } = useCartStore();
  const { itemsCount } = getTotals();
  const { user, profile, signOut } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on route change
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Sea Buckthorn", path: "/about-sea-buckthorn" },
    { name: "About Story", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      {/* Top Rotating Security & Operational Announcement Ticker */}
      <AnnouncementBar />

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
            <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5">
              {/* Instagram Profile */}
              <a
                href="https://www.instagram.com/himroots.wellness/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Himroots on Instagram (@himroots.wellness)"
                aria-label="Follow Himroots on Instagram"
                className="text-gray-300 hover:text-[var(--color-primary)] p-1.5 sm:p-2 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              {/* User Account Button with Interactive Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  title={user ? `My Account (${profile?.full_name || user.email})` : "Sign In / Account"}
                  aria-label="User Account"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                  className={`relative text-gray-300 hover:text-[var(--color-primary)] p-1.5 sm:p-2 rounded-full hover:bg-[var(--color-secondary)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/50 ${
                    isUserMenuOpen ? "text-[var(--color-primary)] bg-[var(--color-secondary)]" : ""
                  }`}
                >
                  {user ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[var(--color-primary)] text-black font-bold text-[10px] sm:text-xs flex items-center justify-center border border-[var(--color-primary-light)] shadow-sm">
                      {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[var(--color-border-gold)] rounded-2xl shadow-2xl p-4 sm:p-5 gold-glow-sm z-50 animate-dropdown"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    {user ? (
                      <div>
                        {/* Member Header */}
                        <div className="flex items-center gap-3 pb-3 border-b border-[var(--color-border)]">
                          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-black font-bold text-sm flex items-center justify-center border border-[var(--color-primary-light)] shadow-sm shrink-0">
                            {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-bold text-white truncate">
                              {profile?.full_name || "Himroots Member"}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">
                              {user.email}
                            </p>
                            <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 mt-1">
                              Verified Member
                            </span>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-2 space-y-1">
                          <Link
                            to="/account?tab=orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-gray-200 hover:text-[var(--color-primary)] transition-colors group"
                          >
                            <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider">
                              <Package className="w-4 h-4 text-[var(--color-primary)]" />
                              My Orders
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
                          </Link>

                          <Link
                            to="/account?tab=addresses"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-gray-200 hover:text-[var(--color-primary)] transition-colors group"
                          >
                            <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider">
                              <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                              Saved Addresses
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
                          </Link>

                          <Link
                            to="/account?tab=profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-gray-200 hover:text-[var(--color-primary)] transition-colors group"
                          >
                            <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider">
                              <User className="w-4 h-4 text-[var(--color-primary)]" />
                              Profile Settings
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
                          </Link>

                          <Link
                            to="/cart"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-gray-200 hover:text-[var(--color-primary)] transition-colors group"
                          >
                            <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider">
                              <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
                              Cart & Saved Items
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-primary)] text-black">
                              {itemsCount}
                            </span>
                          </Link>
                        </div>

                        {/* Sign Out Button */}
                        <div className="pt-2 border-t border-[var(--color-border)]">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Guest Header */}
                        <div className="text-center pb-3 border-b border-[var(--color-border)]">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-border-gold)] text-[var(--color-primary)] mb-2">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <h4 className="font-serif text-sm font-bold text-white">Welcome to Himroots</h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Sign in to track orders, manage saved addresses, and access member benefits.
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 space-y-2">
                          <Link
                            to="/account/login?mode=signin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full h-10 bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-opacity"
                          >
                            Sign In <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                          </Link>

                          <Link
                            to="/account/login?mode=signup"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full h-9 bg-black border border-[var(--color-border-gold)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 font-bold uppercase tracking-wider text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            Create Account
                          </Link>
                        </div>

                        {/* Guest Benefits */}
                        <div className="pt-3 mt-3 border-t border-[var(--color-border)]/60 text-[10px] text-gray-400 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                            <span>Track live order delivery & invoices</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                            <span>Save delivery addresses for fast checkout</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link 
                to="/cart" 
                aria-label="Shopping Cart"
                className="relative text-gray-300 hover:text-[var(--color-primary)] p-1.5 sm:p-2 rounded-full hover:bg-[var(--color-secondary)] transition-colors"
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
                className="md:hidden text-gray-300 hover:text-[var(--color-primary)] p-1.5 rounded-md"
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

              {/* Mobile Account Links */}
              {user ? (
                <div className="pt-2 border-t border-[var(--color-border)]/50 space-y-2">
                  <div className="flex items-center justify-between py-1 text-xs text-gray-400">
                    <span className="font-semibold text-white uppercase tracking-wider">{profile?.full_name || "My Account"}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                      Active
                    </span>
                  </div>
                  <Link
                    to="/account?tab=orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm uppercase tracking-[0.15em] text-gray-300 hover:text-[var(--color-primary)] py-1.5"
                  >
                    • My Orders
                  </Link>
                  <Link
                    to="/account?tab=addresses"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm uppercase tracking-[0.15em] text-gray-300 hover:text-[var(--color-primary)] py-1.5"
                  >
                    • Saved Addresses
                  </Link>
                  <Link
                    to="/account?tab=profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm uppercase tracking-[0.15em] text-gray-300 hover:text-[var(--color-primary)] py-1.5"
                  >
                    • Profile Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-left w-full text-sm uppercase tracking-[0.15em] text-red-400 hover:text-red-300 py-1.5"
                  >
                    • Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/account/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium uppercase tracking-[0.2em] py-2 border-b border-[var(--color-border)]/50 flex items-center justify-between ${
                    location.pathname.startsWith("/account")
                      ? "text-[var(--color-primary)] font-bold"
                      : "text-gray-200 hover:text-[var(--color-primary)]"
                  }`}
                >
                  <span>Sign In / Register</span>
                </Link>
              )}
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
