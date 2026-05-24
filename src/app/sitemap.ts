import type { MetadataRoute } from "next";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";

const data = fontsData as FontsJson;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const fontPages: MetadataRoute.Sitemap = data.fonts.map((font) => ({
    url: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/en`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...fontPages,
  ];
}
