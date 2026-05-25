import type { Metadata } from "next";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const data = fontsData as FontsJson;
  const fontCount = data.fonts.length;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "中文字体库 · Chinese Fonts · Hanzi · Han Characters",
    description: `收录 ${fontCount}+ 款精选中文字体与汉字字体，涵盖简体、繁体、手写体、艺术体、黑体、宋体等风格，支持在线预览与免费下载。${fontCount}+ curated Chinese fonts & Hanzi / Han characters with free preview & download.`,
    url: siteUrl,
    about: {
      "@type": "Thing",
      name: "Chinese Fonts · 中文字体 · Hanzi · Han Characters",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: fontCount,
      itemListElement: data.fonts.slice(0, 50).map((font, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
        name: `${font.name} - ${font.englishName}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sr-only">
        <h1>
          中文字体库 · Chinese Fonts · Hanzi · {fontCount}+ 免费汉字/中文字体在线预览与下载
        </h1>
        <p>
          收录 {fontCount}+ 款精选中文字体与汉字，涵盖简体、繁体、手写体、艺术体、黑体、宋体等多种风格，
          支持在线预览与免费下载。{fontCount}+ curated Chinese fonts &amp; Hanzi / Han characters
          with online preview and free download.
        </p>
      </div>
      <HomeClient fonts={data.fonts} categories={data.categories} />
    </>
  );
}
