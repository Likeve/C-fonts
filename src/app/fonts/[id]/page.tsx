import type { Metadata } from"next";
import { notFound } from"next/navigation";
import fontsData from"@/data/fonts.json";
import type { FontsJson } from"@/types/font";
import FontDetailClient from"@/components/FontDetailClient";

const data = fontsData as FontsJson;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||"https://www.cfont.site";

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
      title:"字体未找到",
      description:"请求的字体不存在。",
    };
  }

  return {
    title: `${font.name} - ${font.englishName}`,
    description: `${font.name} (${font.englishName}) - ${font.categoryZh} | 中文字体库免费在线预览与下载。${font.categoryEn} Chinese font, free preview and download.`,
    keywords: [font.name, font.englishName, font.categoryZh, font.categoryEn,"中文字体","字体下载","字体预览"],
    alternates: {
      canonical: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
    },
    openGraph: {
      title: `${font.name} - ${font.englishName} | 中文字体库`,
      description: `${font.name} (${font.englishName}) - ${font.categoryZh} | 免费在线预览与下载`,
      url: `${siteUrl}/fonts/${encodeURIComponent(font.id)}`,
      type:"article",
      images: font.coverPath
        ? [
            {
              url: font.coverPath.startsWith("http") ? font.coverPath : `${siteUrl}/${font.coverPath}`,
              width: 800,
              height: 600,
              alt: font.name,
            },
          ]
        : [],
    },
    twitter: {
      card:"summary_large_image",
      title: `${font.name} - ${font.englishName}`,
      description: `${font.name} (${font.englishName}) - ${font.categoryZh} | 免费预览与下载`,
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

  return <FontDetailClient font={font} />;
}
