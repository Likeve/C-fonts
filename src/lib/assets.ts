const FONTS_CDN = process.env.NEXT_PUBLIC_FONTS_CDN_URL;

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
    return `${FONTS_CDN}${encoded}`;
  }
  return `/${path}`;
}
