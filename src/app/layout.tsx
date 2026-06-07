import type { Metadata } from "next";
import { headers } from "next/headers";
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
    default: "Download Free Chinese Fonts | 450+ High Quality Chinese Fonts · Hanzi · 中文字体下载",
    template: "%s | Chinese Fonts · 中文字体库",
  },
  description:
    "Download high quality Chinese fonts for free. Browse 450+ curated Chinese fonts & Hanzi characters — handwriting, calligraphy, modern, traditional & more. Online preview & TTF download. 高质量中文字体免费下载，在线预览。",
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
    siteName: "Chinese Fonts",
    title: "Download Free Chinese Fonts | 450+ High Quality Chinese Fonts · Hanzi · 中文字体下载",
    description:
      "Download high quality Chinese fonts for free. 450+ curated Chinese fonts & Hanzi characters. Online preview & TTF download. Handwriting, calligraphy, modern, traditional styles. 高质量中文字体免费下载。",
    url: SITE_URL,
    locale: "zh_CN",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "Download Free Chinese Fonts · 中文字体下载",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Free Chinese Fonts | 450+ High Quality Chinese Fonts",
    description:
      "Download high quality Chinese fonts for free. 450+ curated Chinese fonts with online preview. Handwriting, calligraphy, modern, traditional & more.",
    images: ["/og"],
    },
};

import { LanguageProvider } from "@/components/LanguageProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const lang = headersList.get("x-lang") || "zh";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Chinese Fonts · 中文字体库",
    url: SITE_URL,
    description:
      "Download high quality Chinese fonts for free. 450+ curated Chinese fonts & Hanzi characters — handwriting, calligraphy, modern, traditional styles. Online preview & TTF download. 高质量中文字体免费下载。",
    inLanguage: ["zh-CN", "zh-Hant", "en"],
    keywords: "Chinese fonts, Chinese font download, Hanzi, free fonts, 中文字体, 字体下载",
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
    <html lang={lang} suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} h-full antialiased`}>
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
