import type { Metadata } from "next";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";
import HomeClient from "@/components/HomeClient";
import FaqAccordion from "@/components/FaqAccordion";
import type { FaqItem } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const data = fontsData as FontsJson;
  const fontCount = data.fonts.length;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

  const faqItems: FaqItem[] = [
    {
      question: "How to download Chinese fonts?",
      answer: "Browse our collection, click any Chinese font you like, preview it online with custom text, then click \"Download TTF\" to get the high quality font file. All fonts are in TTF format, compatible with Windows, macOS, and Linux.",
    },
    {
      question: "How to install Chinese fonts?",
      answer: "After downloading the TTF file, double-click it and select \"Install Font.\" On macOS, use Font Book. On Windows, right-click the font file and choose \"Install.\" The font will appear in all your applications including Photoshop, Canva, and Word.",
    },
    {
      question: "Best Chinese fonts for design",
      answer: "For graphic design, we recommend modern sans-serif Chinese fonts for clean layouts, Chinese calligraphy fonts for traditional aesthetics, and Chinese handwriting fonts for a personal touch. Browse our categories to find the perfect style for your project.",
    },
    {
      question: "Are these Chinese fonts free for commercial use?",
      answer: "Our curated collection includes many free Chinese fonts suitable for both personal and commercial projects. Each font's detail page shows the vendor information. We recommend checking the original foundry's license for commercial use.",
    },
  ];

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
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 py-16 border-t border-zinc-200 mt-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-zinc-800 mb-6 text-center">
            Free Chinese Font Download — High Quality Chinese Fonts &amp; Hanzi
          </h2>
          <p className="text-zinc-500 leading-relaxed mb-8 text-center">
            Browse {fontCount}+ free Chinese fonts for download. Our collection includes
            traditional Chinese fonts, simplified Chinese fonts, Chinese handwriting fonts,
            Chinese calligraphy fonts, modern sans-serif, and artistic display fonts.
            Each Chinese font comes with an online preview so you can test
            Hanzi characters before downloading the TTF file.
          </p>

          <div className="mb-8">
            <FaqAccordion items={faqItems} />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-800">
              Popular Chinese font categories
            </h3>
            <div className="flex flex-wrap gap-2 text-sm text-zinc-500">
              <span className="rounded-full bg-zinc-100 px-3 py-1">Chinese handwriting fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Chinese calligraphy fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Modern Chinese fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Traditional Chinese fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Simplified Chinese fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Bold Chinese title fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Cute Chinese fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Chinese brush fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Creative display Chinese fonts</span>
              <span className="rounded-full bg-zinc-100 px-3 py-1">Chinese serif & Song fonts</span>
            </div>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed mt-8 text-center">
            精选{fontCount}+款高质量免费中文字体，涵盖简体中文、繁体中文、手写体、毛笔书法、
            现代黑体、宋体、萌趣字体、创意艺术字等多种风格。每款汉字字体支持在线预览，
            所见即所得，免费下载 TTF 字库文件。适合平面设计、品牌设计、社交媒体等多种场景。
          </p>
        </div>
      </section>
    </>
  );
}
