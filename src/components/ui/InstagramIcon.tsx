import type { ImgHTMLAttributes } from "react";

export function InstagramIcon({ className = "w-5 h-5", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/images/instagram.png"
      alt="Instagram"
      className={`inline-block object-contain rounded-md transition-transform duration-200 hover:scale-105 ${className}`}
      {...props}
    />
  );
}
