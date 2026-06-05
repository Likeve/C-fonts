import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/api/", "/*/success"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
