import { useEffect } from "react";

const FALLBACK_SITE_URL = "https://perksnest.co";
const DEFAULT_OG_IMAGE = `${FALLBACK_SITE_URL}/og-image.svg`;

export interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

function getSiteUrl() {
  return FALLBACK_SITE_URL;
}

function toAbsoluteUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return `${getSiteUrl()}/`;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
}

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

function ensureLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  return element;
}

export function useSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}: SeoOptions) {
  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(path || window.location.pathname);
    const socialImage = toAbsoluteUrl(image);
    const robots = noIndex ? "noindex, nofollow" : "index, follow";

    document.title = title;

    ensureMeta('meta[name="description"]', { name: "description" }).setAttribute("content", description);
    ensureMeta('meta[name="robots"]', { name: "robots" }).setAttribute("content", robots);

    ensureMeta('meta[property="og:title"]', { property: "og:title" }).setAttribute("content", title);
    ensureMeta('meta[property="og:description"]', { property: "og:description" }).setAttribute("content", description);
    ensureMeta('meta[property="og:type"]', { property: "og:type" }).setAttribute("content", type);
    ensureMeta('meta[property="og:url"]', { property: "og:url" }).setAttribute("content", canonicalUrl);
    ensureMeta('meta[property="og:image"]', { property: "og:image" }).setAttribute("content", socialImage);
    ensureMeta('meta[property="og:site_name"]', { property: "og:site_name" }).setAttribute("content", "PerksNest");

    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card" }).setAttribute("content", "summary_large_image");
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title" }).setAttribute("content", title);
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description" }).setAttribute("content", description);
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image" }).setAttribute("content", socialImage);

    ensureLink('link[rel="canonical"]', { rel: "canonical" }).setAttribute("href", canonicalUrl);
  }, [description, image, noIndex, path, title, type]);
}

export function buildCanonicalPath(path: string) {
  return toAbsoluteUrl(path);
}

