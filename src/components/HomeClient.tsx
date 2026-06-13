"use client";

import { useState, useMemo, useEffect } from"react";
import Link from"next/link";
import Image from"next/image";
import { useLanguage } from"@/components/LanguageProvider";
import { t, vendors } from"@/lib/i18n";
import { getAssetUrl } from"@/lib/assets";
import { createClient } from"@/lib/supabase/client";
import LoginModal from"./LoginModal";
import PurchaseModal from"./PurchaseModal";
import type { FontData, CategoryData } from"@/types/font";
import type { User } from"@supabase/supabase-js";

interface HomeClientProps {
  fonts: FontData[];
  categories: CategoryData[];
}

const ITEMS_PER_PAGE = 30;

export default function HomeClient({ fonts, categories }: HomeClientProps) {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseFontId, setPurchaseFontId] = useState("");
  const [purchaseFontName, setPurchaseFontName] = useState("");
  const [downloadingFontId, setDownloadingFontId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = fonts;
    if (activeCategory !=="all") {
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageFonts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    }).catch(() => {});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const triggerDownload = async (url: string, englishName: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${englishName}.ttf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  const handleFontDownload = async (font: FontData) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setDownloadingFontId(font.id);
    try {
      const res = await fetch("/api/user/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fontId: font.id }),
      });

      if (res.status === 402) {
        setPurchaseFontId(font.id);
        setPurchaseFontName(font.name);
        setShowPurchaseModal(true);
        setDownloadingFontId(null);
        return;
      }

      const data = await res.json();
      if (data.success && data.downloadUrl) {
        await triggerDownload(data.downloadUrl, font.englishName);
      }
    } catch {
      // ignore
    }
    setDownloadingFontId(null);
  };

  const getPageNumbers = (): (number |"...")[] => {
    const pages: (number |"...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-8">
      <section className="mb-8">
        <div className="relative mb-6">
          <label htmlFor="font-search" className="sr-only">
            {t("searchPlaceholder", lang)}
          </label>
          <input
            id="font-search"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder", lang)}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 pl-11 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
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

        <p className="mb-3 text-sm text-zinc-500">
          {filtered.length} {lang ==="zh" ?"个结果" :"results"}
        </p>

        <nav aria-label={t("categories", lang)} className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              activeCategory ==="all"
                ?"bg-[#efe9de] text-zinc-800"
                :"text-zinc-500 hover:bg-zinc-100"
            }`}
            aria-current={activeCategory ==="all" ?"page" : undefined}
          >
            {t("allFonts", lang)}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ?"bg-[#efe9de] text-zinc-800"
                  :"text-zinc-500 hover:bg-zinc-100"
              }`}
              aria-current={activeCategory === cat.slug ?"page" : undefined}
            >
              {lang ==="zh" ? cat.zh : cat.en} ({cat.count})
            </button>
          ))}
        </nav>
      </section>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-zinc-400">
          <p className="text-lg">{lang ==="zh" ?"没有找到匹配的字体" :"No fonts found"}</p>
        </div>
      ) : (
        <section>
          <h2 className="sr-only">{lang ==="zh" ?"字体列表" :"Font List"}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {pageFonts.map((font) => {
              const cover = getAssetUrl(font.coverPath);
              return (
                <Link
                  key={font.id}
                  href={`/fonts/${encodeURIComponent(font.id)}`}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-[#e6dfd8] bg-[#efe9de] transition-all duration-300 hover:-translate-y-0.5"
                >
                  {font.tag ==="no_cover" && (
                    <div className="absolute right-2 top-2 z-10 rounded-full bg-white/60 px-2 py-0.5 text-[10px] font-medium text-zinc-600 backdrop-blur-sm">
                      {t("noCoverTag", lang)}
                    </div>
                  )}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-50">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${font.name} - ${font.englishName} Chinese font`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl text-zinc-400/50">
                          {font.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {font.fontPath && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFontDownload(font);
                        }}
                        disabled={downloadingFontId === font.id}
                        className="absolute right-3 bottom-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:shadow-lg disabled:opacity-60"
                        aria-label={lang ==="zh" ? "下载字体" : "Download font"}
                      >
                        {downloadingFontId === font.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                        ) : (
                          <svg className="h-4 w-4 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 p-4">
                    <h3 className="truncate text-sm font-medium text-zinc-800">
                      {lang ==="en" ? font.englishName : font.name}
                    </h3>
                    <p className="truncate text-xs text-zinc-500">
                      {vendors[font.vendor]?.[lang] || font.vendor}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {getPageNumbers().map((p, i) =>
                p ==="..." ? (
                  <span key={`dots-${i}`} className="px-2 text-sm text-zinc-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      p === currentPage
                        ?"bg-zinc-900 text-white"
                        :"text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          )}
        </section>
      )}

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <PurchaseModal
        open={showPurchaseModal}
        fontId={purchaseFontId}
        fontName={purchaseFontName}
        onClose={() => setShowPurchaseModal(false)}
      />
    </div>
  );
}
