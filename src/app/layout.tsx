import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cfont.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "中文字体库 - Chinese Fonts | 免费中文字体预览与下载",
    template: "%s | 中文字体库",
  },
  description:
    "精选中文字体库，涵盖手写体、艺术体、黑体、宋体等多种风格，支持在线预览与免费下载。Curated Chinese fonts collection with online preview and free download.",
  keywords: [
    "中文字体",
    "免费字体",
    "字体下载",
    "字体预览",
    "Chinese fonts",
    "free fonts",
    "font download",
    "中文字体库",
  ],
  authors: [{ name: "中文字体库" }],
  creator: "中文字体库",
  publisher: "中文字体库",
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
      en: `${SITE_URL}/en`,
    },
  },
  openGraph: {
    type: "website",
    siteName: "中文字体库",
    title: "中文字体库 - Chinese Fonts | 免费预览与下载",
    description:
      "精选中文字体库，涵盖手写体、艺术体、黑体、宋体等多种风格，支持在线预览与免费下载。",
    url: SITE_URL,
    locale: "zh_CN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "中文字体库",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "中文字体库 - Chinese Fonts",
    description:
      "精选中文字体库，涵盖手写体、艺术体、黑体、宋体等多种风格，支持在线预览与免费下载。",
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
    name: "中文字体库",
    url: SITE_URL,
    description:
      "精选中文字体库，涵盖手写体、艺术体、黑体、宋体等多种风格，支持在线预览与免费下载。",
    inLanguage: ["zh-CN", "en"],
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
    <html lang="zh" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
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
