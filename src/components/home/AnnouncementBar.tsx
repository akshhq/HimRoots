import { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Phone, Globe, ChevronRight } from "lucide-react";

export function AnnouncementBar() {
  const announcements = [
    {
      icon: Sparkles,
      text: "Pure Himalayan Sea Buckthorn Formulations — Free Cold-Chain Delivery Across India",
      link: "/shop",
      linkText: "Shop Harvest",
    },
    {
      icon: ShieldCheck,
      text: "Prepaid Order Security: Official Support Number +91 84286 11319 • We will never call to request unauthorized OTPs",
      link: "/contact",
      linkText: "Verify Security",
    },
    {
      icon: Globe,
      text: "International Shipping Available — Ethically Wild-Harvested at 12,000+ Ft in Ladakh & Spiti",
      link: "/contact",
      linkText: "Worldwide Inquiries",
    },
    {
      icon: Sparkles,
      text: "Wild Winter Harvest Batches Now Live — Packed with Rare Omega-7 & 190+ Active Bioactives",
      link: "/about-sea-buckthorn",
      linkText: "Discover Terroir",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const current = announcements[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="bg-[#050505] border-b border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)] py-2 px-3 sm:px-6 relative overflow-hidden transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Indicator on Desktop */}
        <div className="hidden md:flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-[var(--color-primary)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span>HIMROOTS LIVE DESPATCH</span>
        </div>

        {/* Center Animated Message */}
        <div className="flex-1 flex items-center justify-center text-center gap-2 text-[11px] sm:text-xs">
          <IconComponent className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
          <span className="text-gray-200 font-medium tracking-wide truncate max-w-xl sm:max-w-none">
            {current.text}
          </span>
          {current.linkText && (
            <a
              href={current.link}
              className="hidden lg:inline-flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-light)] font-bold tracking-wider uppercase text-[10px] underline ml-1.5"
            >
              <span>{current.linkText}</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Right Contact Quick Pill */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-gray-400">
          <Phone className="w-3 h-3 text-[var(--color-primary)]" />
          <span className="font-mono text-[10px] text-gray-300">+91 84286 11319</span>
        </div>

      </div>
    </div>
  );
}
