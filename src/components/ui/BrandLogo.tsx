interface BrandLogoProps {
  className?: string;
  imgClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showSubtitle?: boolean;
}

export function BrandLogo({ className = "", imgClassName, size = "md", showSubtitle = false }: BrandLogoProps) {
  const sizeMap = {
    xs: {
      imgClass: "h-8 w-auto",
      subClass: "text-[7px] tracking-[0.25em]",
    },
    sm: {
      imgClass: "h-11 sm:h-13 w-auto",
      subClass: "text-[8px] tracking-[0.25em]",
    },
    md: {
      imgClass: "h-16 sm:h-20 w-auto",
      subClass: "text-[9px] tracking-[0.3em]",
    },
    lg: {
      imgClass: "h-24 sm:h-28 w-auto",
      subClass: "text-[11px] tracking-[0.35em]",
    },
    xl: {
      imgClass: "h-36 sm:h-48 md:h-56 w-auto",
      subClass: "text-[13px] tracking-[0.4em]",
    },
    "2xl": {
      imgClass: "h-48 sm:h-64 md:h-80 w-auto",
      subClass: "text-[15px] tracking-[0.45em]",
    },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none group ${className}`}>
      <img
        src="/images/himroots-logo.png"
        alt="HIMROOTS — Pure • Natural • Wild"
        className={`${imgClassName || current.imgClass} object-contain transition-all duration-300 filter drop-shadow-[0_2px_8px_rgba(223,183,108,0.25)] group-hover:drop-shadow-[0_4px_16px_rgba(223,183,108,0.5)]`}
      />

      {showSubtitle && (
        <span
          className={`uppercase text-[var(--color-primary)] font-semibold mt-1.5 opacity-90 transition-opacity group-hover:opacity-100 ${current.subClass}`}
        >
          PURE • NATURAL • WILD
        </span>
      )}
    </div>
  );
}
