function enforceHTTPS(url: string) {
  if (!url.startsWith("http")) {
    return `https://${url}`;
  }
  return url;
}

export const BASE_URL = enforceHTTPS(
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "web3sdks.com"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? process.env.NEXT_PUBLIC_VERCEL_URL || "web3sdks.com"
    : "web3sdks.com",
);

export const OG_IMAGE_BASE_URL = enforceHTTPS(
  process.env.NEXT_PUBLIC_OG_IMAGE_BASE || "https://og-image.web3sdks.com",
);

// OG IMAGE RELATED
export const OG_IMAGE_CACHE_VERSION = "1.0.3";
export const TWEMOJI_OPTIONS = { folder: "svg", ext: ".svg" };
