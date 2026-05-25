import type { MetadataRoute } from "next";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";

const data = fontsData as FontsJson;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const fontPages: MetadataRoute.Sitemap = data.fonts.map((font) => ({
    url: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/zh`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      url: `${siteUrl}/zh-Hant`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...fontPages,
  ];
}
