import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "中文字体库 · Chinese Fonts · 400+ 免费中文字体/汉字在线预览与下载 · Hanzi · Han Characters",
    template: "%s | 中文字体库 · Chinese Fonts",
  },
  description:
    "收录 400+ 款精选中文字体与汉字字体，涵盖简体、繁体、手写体、艺术体、黑体、宋体等风格，支持在线预览与免费下载。400+ curated Chinese fonts & Hanzi / Han characters. Free preview and download for simplified & traditional Chinese.",
  keywords: [
    "中文字体",
    "汉字",
    "中文汉字",
    "繁体",
    "简体",
    "免费字体",
    "字体下载",
    "字体预览",
    "Chinese fonts",
    "Chinese characters",
    "Hanzi",
    "Han characters",
    "free fonts",
    "font download",
    "中文字体库",
    "400+中文字体",
    "400+汉字",
  ],
  authors: [{ name: "中文字体库 · Chinese Fonts" }],
  creator: "中文字体库 · Chinese Fonts",
  publisher: "中文字体库 · Chinese Fonts",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    languages: {
      zh: SITE_URL,
      "zh-Hant": `${SITE_URL}/zh-Hant`,
      en: `${SITE_URL}/en`,
    },
  },
  openGraph: {
    type: "website",
    siteName: "中文字体库 · Chinese Fonts",
    title: "中文字体库 · Chinese Fonts · 400+ 免费汉字字体预览与下载 · Hanzi",
    description:
      "收录 400+ 款精选中文字体与汉字，涵盖简体繁体、手写艺术黑体宋体。400+ Chinese fonts & Han characters. Free preview & download.",
    url: SITE_URL,
    locale: "zh_CN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "中文字体库 · Chinese Fonts · Hanzi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "中文字体库 · Chinese Fonts · 400+ Hanzi",
    description:
      "收录 400+ 款精选中文字体与汉字，涵盖简体繁体、手写艺术黑体宋体。400+ Chinese fonts & Han characters. Free preview & download.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/font.svg",
    apple: "/font.svg",
  },
};

import { LanguageProvider } from "@/components/LanguageProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "中文字体库 · Chinese Fonts",
    url: SITE_URL,
    description:
      "收录 400+ 款精选中文字体与汉字字体，涵盖简体、繁体、手写体、艺术体、黑体、宋体等风格，支持在线预览与免费下载。400+ Chinese fonts & Hanzi characters with online preview & free download.",
    inLanguage: ["zh-CN", "zh-Hant", "en"],
    keywords: "中文字体,汉字,繁体,Chinese fonts,Chinese characters,Hanzi,Han characters,字体下载,字体预览,400+中文字体",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="zh" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
