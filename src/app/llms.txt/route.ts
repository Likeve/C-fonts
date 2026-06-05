import { NextResponse } from "next/server";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";

const data = fontsData as FontsJson;

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";
  const fontCount = data.fonts.length;

  const categories = [
    ...new Map(data.fonts.map((f) => [f.categoryEn, f.categoryZh])).entries(),
  ];

  const body = [
    `# ${siteUrl}`,
    ``,
    `> 中文字体库 · Chinese Fonts · Hanzi · Han Characters`,
    `> ${fontCount}+ curated Chinese fonts with free online preview and download.`,
    `> 收录 ${fontCount}+ 款精选中文字体，涵盖简体、繁体、手写体、艺术体、黑体、宋体等多种风格。`,
    ``,
    `## About`,
    ``,
    `Chinese Font Library (cfont.site) is a curated collection of ${fontCount}+ Chinese fonts / Hanzi / Han characters.`,
    `All fonts are free to preview online and download. The collection covers simplified Chinese (简体中文),`,
    `traditional Chinese (繁體中文), calligraphy (手写体), artistic (艺术体), sans-serif (黑体),`,
    `serif (宋体), and many other styles.`,
    ``,
    `The website supports three language variants: 简体中文 (/zh), 繁體中文 (/zh-Hant), and English (/en).`,
    `Each font has its own detail page with live preview, download links, and metadata in all three languages.`,
    ``,
    `## Categories`,
    ``,
    ...categories.map(([en, zh]) => `- ${zh} / ${en}`),
    ``,
    `## Font Directory`,
    ``,
    `Full font list available at: \`${siteUrl}/api/llms/fonts\``,
    ``,
    `Individual font pages: \`${siteUrl}/fonts/{font-id}\``,
    ``,
    `Sample font IDs and names:`,
    ``,
    ...data.fonts.slice(0, 30).map(
      (f) => `- [${f.name} / ${f.englishName}](${siteUrl}/fonts/${encodeURIComponent(f.id)}) — ${f.categoryZh} / ${f.categoryEn}`
    ),
    ``,
    `## Optional`,
    ``,
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    `- [English version](${siteUrl}/en)`,
    `- [繁體中文版本](${siteUrl}/zh-Hant)`,
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
