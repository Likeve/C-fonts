"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import { t, vendors } from "@/lib/i18n";
import { getAssetUrl } from "@/lib/assets";
import type { FontData, CategoryData } from "@/types/font";

interface HomeClientProps {
  fonts: FontData[];
  categories: CategoryData[];
}

function getColumns(): number {
  if (typeof window === "undefined") return 5;
  const w = window.innerWidth;
  if (w >= 1024) return 5;
  if (w >= 768) return 4;
  if (w >= 640) return 3;
  return 2;
}

const ROWS_PER_BATCH = 3;

export default function HomeClient({ fonts, categories }: HomeClientProps) {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(0);
  const [columns, setColumns] = useState(5);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = fonts;
    if (activeCategory !== "all") {
      result = result.filter((f) => f.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.englishName.toLowerCase().includes(q) ||
          f.categoryZh.includes(q) ||
          f.categoryEn.toLowerCase().includes(q) ||
          f.vendor.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, activeCategory, fonts]);

  useEffect(() => {
    setVisibleCount(0);
  }, [search, activeCategory]);

  const batchSize = columns * ROWS_PER_BATCH;

  useEffect(() => {
    if (visibleCount === 0 && filtered.length > 0) {
      setVisibleCount(batchSize);
    }
  }, [filtered.length, batchSize, visibleCount]);

  useEffect(() => {
    const updateColumns = () => setColumns(getColumns());
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, filtered.length));
  }, [batchSize, filtered.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length, loadMore]);

  const visibleFonts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <section className="mb-8">
        <div className="relative mb-6">
          <label htmlFor="font-search" className="sr-only">
            {t("searchPlaceholder", lang)}
          </label>
          <input
            id="font-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder", lang)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pl-11 text-sm shadow-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
          />
          <svg
            className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          {filtered.length} {lang === "zh" ? "个结果" : "results"}
        </p>

        <nav aria-label={t("categories", lang)} className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
            aria-current={activeCategory === "all" ? "page" : undefined}
          >
            {t("allFonts", lang)}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
              aria-current={activeCategory === cat.slug ? "page" : undefined}
            >
              {lang === "zh" ? cat.zh : cat.en} ({cat.count})
            </button>
          ))}
        </nav>
      </section>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-zinc-400">
          <p className="text-lg">{lang === "zh" ? "没有找到匹配的字体" : "No fonts found"}</p>
        </div>
      ) : (
        <section>
          <h2 className="sr-only">{lang === "zh" ? "字体列表" : "Font List"}</h2>
          <div
            ref={gridRef}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {visibleFonts.map((font) => {
              const cover = getAssetUrl(font.coverPath);
              return (
                <Link
                  key={font.id}
                  href={`/fonts/${encodeURIComponent(font.id)}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  {font.tag === "no_cover" && (
                    <div className="absolute right-2 top-2 z-10 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {t("noCoverTag", lang)}
                    </div>
                  )}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={font.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl text-zinc-300 dark:text-zinc-600">
                          {font.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 p-3">
                    <h3 className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {lang === "en" ? font.englishName : font.name}
                    </h3>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {vendors[font.vendor]?.[lang] || font.vendor}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          {hasMore && (
            <div ref={sentinelRef} className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400" />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
