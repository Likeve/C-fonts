import type { Metadata } from "next";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";
import HomeClient from "@/components/HomeClient";
import HomeSemanticContent from "@/components/HomeSemanticContent";

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
    name: "Download Free Chinese Fonts | High Quality Chinese Fonts · Hanzi",
    description: `Download high quality Chinese fonts for free. Browse ${fontCount}+ curated Chinese fonts & Hanzi characters — handwriting, calligraphy, modern, traditional styles. Online preview & TTF download. 高质量中文字体免费下载。`,
    url: siteUrl,
    about: {
      "@type": "Thing",
      name: "Chinese Fonts · High Quality Chinese Font Download",
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
          Download Free Chinese Fonts · High Quality Chinese Fonts · Hanzi · {fontCount}+ 中文字体在线预览与免费下载
        </h1>
        <p>
          下载 {fontCount}+ 款高质量免费中文字体，涵盖简体、繁体、手写体、毛笔书法、黑体、宋体等多种风格，
          支持在线预览与免费 TTF 下载。Download {fontCount}+ high quality Chinese fonts &amp; Hanzi
          characters with online preview and free TTF download.
        </p>
      </div>
      <HomeClient fonts={data.fonts} categories={data.categories} />
      <HomeSemanticContent fontCount={fontCount} />
    </>
  );
}
