const FONTS_CDN = process.env.NEXT_PUBLIC_FONTS_CDN_URL;

function normalizeCdnUrl(url: string): string {
  let normalized = url;
  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`;
  }
  if (!normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }
  return normalized;
}

export function getAssetUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (FONTS_CDN && path.startsWith("fonts/")) {
    const encoded = path
      .split("/")
      .map((seg) => encodeURIComponent(seg))
      .join("/");
    const base = normalizeCdnUrl(FONTS_CDN);
    return `${base}${encoded}`;
  }
  return `/${path}`;
}
