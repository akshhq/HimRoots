import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "product" | "article";
  noindex?: boolean;
  keywords?: string;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_ORIGIN = "https://himroots.in";
const DEFAULT_IMAGE = "https://himroots.in/images/himroots-harvest-berries.jpg";

export function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  keywords,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to get or create meta/link elements
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // 2. Standard Meta
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }

    // 3. Canonical Link
    const currentOrigin = typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : DEFAULT_ORIGIN;
    
    // Default to canonical domain if provided or build from path
    const resolvedCanonical = canonical
      ? canonical.startsWith("http")
        ? canonical
        : `${DEFAULT_ORIGIN}${canonical.startsWith("/") ? "" : "/"}${canonical}`
      : typeof window !== "undefined"
      ? `${DEFAULT_ORIGIN}${window.location.pathname}`
      : DEFAULT_ORIGIN;

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", resolvedCanonical);

    // 4. Open Graph Tags
    const resolvedImage = image.startsWith("http") ? image : `${currentOrigin}${image.startsWith("/") ? "" : "/"}${image}`;

    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", resolvedCanonical);
    setMetaTag("property", "og:image", resolvedImage);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:site_name", "Himroots Wellness");

    // 5. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", resolvedImage);

    // 6. JSON-LD Structured Data
    const scriptId = "himroots-structured-data";
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = scriptId;
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData, null, 2);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Clean up page-specific JSON-LD when component unmounts
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [title, description, canonical, image, type, noindex, keywords, structuredData]);

  return null;
}
