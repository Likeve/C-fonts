import type { MetadataRoute } from "next";
import { statSync } from "fs";
import { join } from "path";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";

const data = fontsData as FontsJson;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

const fontsJsonPath = join(process.cwd(), "src/data/fonts.json");
let fontsLastModified: Date;
try {
  fontsLastModified = statSync(fontsJsonPath).mtime;
} catch {
  fontsLastModified = new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const fontPages: MetadataRoute.Sitemap = data.fonts.map((font) => ({
    url: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
    lastModified: fontsLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        zh: `${siteUrl}/zh/fonts/${encodeURIComponent(font.id)}`,
        "zh-Hant": `${siteUrl}/zh-Hant/fonts/${encodeURIComponent(font.id)}`,
        en: `${siteUrl}/en/fonts/${encodeURIComponent(font.id)}`,
      },
    },
  }));

  return [
    {
      url: siteUrl,
      lastModified: fontsLastModified,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/zh`,
      lastModified: fontsLastModified,
      changeFrequency: "daily" as const,
      priority: 0.95,
    },
    {
      url: `${siteUrl}/zh-Hant`,
      lastModified: fontsLastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/en`,
      lastModified: fontsLastModified,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...fontPages,
  ];
}
