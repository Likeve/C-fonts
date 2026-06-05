import { NextResponse } from "next/server";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";

const data = fontsData as FontsJson;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

  const fonts = data.fonts.map((f) => ({
    id: f.id,
    name: f.name,
    englishName: f.englishName,
    categoryZh: f.categoryZh,
    categoryEn: f.categoryEn,
    vendor: f.vendor,
    url: `${siteUrl}/fonts/${encodeURIComponent(f.id)}`,
  }));

  return NextResponse.json(
    {
      site: "中文字体库 · Chinese Fonts · Hanzi · Han Characters",
      url: siteUrl,
      total: fonts.length,
      description: `${fonts.length}+ curated Chinese fonts with free online preview and download. Covers simplified Chinese, traditional Chinese, calligraphy, artistic, sans-serif, serif, and more. / ${fonts.length}+ 款精选中文字体，涵盖简体、繁体、手写体、艺术体、黑体、宋体等风格。`,
      keywords: [
        "Chinese fonts",
        "Chinese characters",
        "Hanzi",
        "Han characters",
        "中文字体",
        "汉字",
        "繁体",
        "简体",
        "free fonts",
      ],
      languages: {
        zh: `${siteUrl}/zh`,
        "zh-Hant": `${siteUrl}/zh-Hant`,
        en: `${siteUrl}/en`,
      },
      fonts,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
