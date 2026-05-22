"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { t, vendors } from "@/lib/i18n";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";

const data = fontsData as FontsJson;

export default function FontDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const { lang } = useLanguage();
  const [previewText, setPreviewText] = useState(
    "山重水复疑无路，柳暗花明又一村。"
  );
  const [fontLoaded, setFontLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const font = data.fonts.find((f) => f.id === id);

  const fontPath = font?.fontPath;
  const encodedPath = fontPath
    ? fontPath.split("/").map(encodeURIComponent).join("/")
    : "";

  useEffect(() => {
    if (!fontPath || !font) {
      if (!fontPath) setLoading(false);
      return;
    }

    setLoading(true);
    setFontLoaded(false);

    const family = font.id.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "-");

    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: "${family}";
        src: url("/${encodedPath}");
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    document.fonts.load(`16px "${family}"`).then(() => {
      setFontLoaded(true);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => {
      document.head.removeChild(style);
    };
  }, [fontPath, font?.id, encodedPath]);

  useEffect(() => {
    const family = font?.id?.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "-") || "";
    if (fontLoaded && previewRef.current && family) {
      previewRef.current.style.fontFamily = `"${family}"`;
    }
  }, [fontLoaded, font]);

  if (!font) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">
          {lang === "zh" ? "字体未找到" : "Font Not Found"}
        </h2>
        <Link href="/" className="mt-4 inline-block text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200">
          {t("backToHome", lang)}
        </Link>
      </div>
    );
  }

  const displayName = lang === "en" ? font.englishName : font.name;

  const getCoverPath = (): string | null => {
    if (!font.coverPath) return null;
    return "/" + font.coverPath;
  };

  const cover = getCoverPath();
  const fontFamily = font.id.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "-");
  const ttfUrl = `/${encodedPath}`;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("backToHome", lang)}
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            {cover ? (
              <Image
                src={cover}
                alt={displayName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-7xl text-zinc-300 dark:text-zinc-600">
                  {font.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{displayName}</h2>
              {font.tag === "no_cover" && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {t("noCoverTag", lang)}
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("category", lang)}</span>
                <span>{lang === "zh" ? font.categoryZh : font.categoryEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("vendor", lang)}</span>
                <span>{vendors[font.vendor]?.[lang] || font.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("status", lang)}</span>
                <span>
                  {font.tag === "no_cover" ? t("noCoverTag", lang) : t("perfect", lang)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("fontFile", lang)}</span>
                <span className="truncate max-w-[180px] text-right">
                  {font.name}.ttf
                </span>
              </div>
            </div>

            <a
              href={ttfUrl}
              download={`${font.name}.ttf`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t("downloadTtf", lang)}
            </a>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h3 className="mb-4 text-lg font-semibold">{t("preview", lang)}</h3>

          <textarea
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
            placeholder={t("typeToPreview", lang)}
          />

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400" />
              </div>
            ) : (
              <div
                ref={previewRef}
                className="min-h-[200px] break-words text-3xl leading-relaxed text-zinc-900 dark:text-zinc-100"
                style={{
                  fontFamily: fontLoaded ? `"${fontFamily}"` : "inherit",
                }}
              >
                {previewText || (
                  <span className="text-zinc-300 dark:text-zinc-600">
                    {t("typeToPreview", lang)}
                  </span>
                )}
              </div>
            )}
          </div>

          {fontLoaded && (
            <div className="mt-6 space-y-2">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {lang === "zh" ? "字体大小预览" : "Font size preview"}
              </p>
              <div className="space-y-3">
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 16 }} className="text-zinc-900 dark:text-zinc-100">
                  16px - 中文字体展示 Chinese Font Display
                </p>
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 24 }} className="text-zinc-900 dark:text-zinc-100">
                  24px - 中文字体展示 Chinese Font Display
                </p>
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 32 }} className="text-zinc-900 dark:text-zinc-100">
                  32px - 中文字体展示
                </p>
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 48 }} className="text-zinc-900 dark:text-zinc-100">
                  48px - 字体展示
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
