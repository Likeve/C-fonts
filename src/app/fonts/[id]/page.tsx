import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";
import FontDetailClient from "@/components/FontDetailClient";

const data = fontsData as FontsJson;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

export function generateStaticParams() {
  return data.fonts.map((font) => ({
    id: font.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const font = data.fonts.find((f) => f.id === decodedId);

  if (!font) {
    return {
      title: "字体未找到",
      description: "请求的字体不存在。",
    };
  }

  const fontCount = data.fonts.length;

  return {
    title: `Download ${font.name} - ${font.englishName} | Free ${font.categoryEn} Chinese Font`,
    description: `Download high quality ${font.name}（${font.englishName}）Chinese font for free. A ${font.categoryEn.toLowerCase()} style Chinese font with online preview and TTF download. ${fontCount}+ curated Chinese fonts & Hanzi characters. ${font.categoryZh}高质量中文字体免费下载。`,
    keywords: [
      `download ${font.name}`,
      `${font.name} Chinese font`,
      `free ${font.categoryEn.toLowerCase()} Chinese font`,
      `${font.englishName} font download`,
      "Chinese font free download",
      "high quality Chinese font",
    ],
    alternates: {
      canonical: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
      languages: {
        zh: `${siteUrl}/zh/fonts/${encodeURIComponent(font.id)}`,
        "zh-Hant": `${siteUrl}/zh-Hant/fonts/${encodeURIComponent(font.id)}`,
        en: `${siteUrl}/en/fonts/${encodeURIComponent(font.id)}`,
      },
    },
    openGraph: {
      title: `Download ${font.name} - ${font.englishName} · Free Chinese Font`,
      description: `Download high quality ${font.name}（${font.englishName}）Chinese font for free. ${font.categoryEn} style with online preview. ${fontCount}+ curated Chinese fonts. 高质量中文字体免费下载。`,
      url: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
      type: "article",
      images: font.coverPath
        ? [
            {
              url: font.coverPath.startsWith("http") ? font.coverPath : `${siteUrl}/${font.coverPath}`,
              width: 800,
              height: 600,
              alt: `${font.name} - ${font.englishName} Chinese font preview`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `Download ${font.name} · Free Chinese Font`,
      description: `Download high quality ${font.name} Chinese font for free. ${font.categoryEn} style. Online preview & TTF download. 高质量中文字体下载。`,
      images: font.coverPath
        ? [font.coverPath.startsWith("http") ? font.coverPath : `${siteUrl}/${font.coverPath}`]
        : [],
    },
  };
}

export default async function FontDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const font = data.fonts.find((f) => f.id === decodedId);

  if (!font) {
    notFound();
  }

  const fontCount = data.fonts.length;
  const coverUrl = font.coverPath
    ? font.coverPath.startsWith("http")
      ? font.coverPath
      : `${siteUrl}/${font.coverPath}`
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${font.name} - ${font.englishName}`,
    description: `Download high quality ${font.name}（${font.englishName}）Chinese font for free. A ${font.categoryEn} style Chinese font. Online preview & TTF download.`,
    keywords: `download ${font.name}, ${font.englishName}, ${font.categoryEn} Chinese font, high quality Chinese font free download`,
    creator: {
      "@type": "Organization",
      name: font.vendor,
    },
    ...(coverUrl ? { thumbnailUrl: coverUrl } : {}),
    about: {
      "@type": "Thing",
      name: "High Quality Chinese Font · Free Chinese Font Download",
    },
  };

  const digitalDocumentLd = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: `${font.name} - ${font.englishName}`,
    description: `Download high quality ${font.name} Chinese font for free. ${font.categoryEn} style. TTF format.`,
    author: {
      "@type": "Organization",
      name: font.vendor,
    },
    encodingFormat: "font/ttf",
    about: {
      "@type": "Thing",
      name: `${font.categoryEn} Chinese Font · Hanzi`,
    },
    ...(coverUrl ? { thumbnailUrl: coverUrl } : {}),
    creativeWorkStatus: "Published",
    datePublished: "2024-01-01",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Chinese Fonts",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: font.categoryEn,
        item: `${siteUrl}/?category=${encodeURIComponent(font.category)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${font.name} - ${font.englishName}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(digitalDocumentLd) }}
      />
      <FontDetailClient font={font} />
    </>
  );
}
