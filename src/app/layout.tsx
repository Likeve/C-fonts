import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "中文字体库 - Chinese Fonts",
  description: "精选中文字体，免费预览与下载。Curated Chinese fonts, preview & download for free.",
  icons: {
    icon: "/font.svg",
  },
};

import { LanguageProvider } from "@/components/LanguageProvider";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            中文字体库 &copy; {new Date().getFullYear()}
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
