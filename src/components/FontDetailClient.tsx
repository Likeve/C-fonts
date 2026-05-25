"use client";

import { useState, useEffect, useRef, useCallback } from"react";
import Link from"next/link";
import Image from"next/image";
import { useLanguage } from"@/components/LanguageProvider";
import { t, vendors } from"@/lib/i18n";
import { getAssetUrl } from"@/lib/assets";
import { createClient } from"@/lib/supabase/client";
import LoginModal from"./LoginModal";
import PurchaseModal from"./PurchaseModal";
import type { FontData } from"@/types/font";
import type { User } from"@supabase/supabase-js";

interface FontDetailClientProps {
  font: FontData;
}

export default function FontDetailClient({ font }: FontDetailClientProps) {
  const { lang } = useLanguage();
  const [previewText, setPreviewText] = useState(
"山重水复疑无路，柳暗花明又一村。"
  );
  const [fontLoaded, setFontLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [downloadsInfo, setDownloadsInfo] = useState<{
    remaining: number |"unlimited";
    freeLimit: number;
    freeDownloadsUsed: number;
    hasUnlimited: boolean;
    downloadedFontIds: string[];
    purchasedFontIds: string[];
  } | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const fontUrl = getAssetUrl(font?.fontPath ?? null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDownloadsInfo = useCallback(() => {
    fetch("/api/user/downloads")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setDownloadsInfo(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchDownloadsInfo();
  }, [user, fetchDownloadsInfo]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState ==="visible" && user) {
        fetchDownloadsInfo();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [user, fetchDownloadsInfo]);

  useEffect(() => {
    if (!fontUrl || !font) {
      if (!fontUrl) setLoading(false);
      return;
    }

    setLoading(true);
    setFontLoaded(false);

    const family = font.id.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g,"-");

    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family:"${family}";
        src: url("${fontUrl}");
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    document.fonts.load(`16px"${family}"`).then(() => {
      setFontLoaded(true);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    return () => {
      document.head.removeChild(style);
    };
  }, [fontUrl, font?.id]);

  useEffect(() => {
    const family = font?.id?.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g,"-") ||"";
    if (fontLoaded && previewRef.current && family) {
      previewRef.current.style.fontFamily = `"${family}"`;
    }
  }, [fontLoaded, font]);

  const triggerDownload = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${font.name}.ttf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url,"_blank");
    }
  };

  const handleDownload = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setCheckingOut(true);
    try {
      const res = await fetch("/api/user/downloads", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ fontId: font.id }),
      });

      if (res.status === 402) {
        setShowPurchaseModal(true);
        setCheckingOut(false);
        return;
      }

      const data = await res.json();

      if (data.success && data.downloadUrl) {
        await triggerDownload(data.downloadUrl);
        fetch("/api/user/downloads")
          .then((r) => r.json())
          .then((d) => {
            if (!d.error) setDownloadsInfo(d);
          })
          .catch(() => {});
      }
    } catch {
      // ignore
    }
    setCheckingOut(false);
  };

  const [checkingUnlimited, setCheckingUnlimited] = useState(false);

  const handleUnlimitedPurchase = async () => {
    setCheckingUnlimited(true);
    try {
      const res = await fetch("/api/checkout", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ fontId: font.id, fontName: font.name, plan:"unlimited" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
    setCheckingUnlimited(false);
  };

  const displayName = lang ==="en" ? font.englishName : font.name;
  const cover = getAssetUrl(font.coverPath);
  const fontFamily = font.id.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g,"-");

  const fontOwned =
    downloadsInfo != null &&
    (downloadsInfo.downloadedFontIds.includes(font.id) ||
      downloadsInfo.purchasedFontIds.includes(font.id));

  const buttonLabel = !fontUrl
    ? t("previewNotAvailable", lang)
    : authLoading
      ? t("loading", lang)
      : !user
        ? lang ==="zh"
          ?"登录后免费下载"
          :"Sign in to download free"
        : !downloadsInfo
          ? t("loading", lang)
          : fontOwned
            ? lang ==="zh"
              ?"再次下载"
              :"Download again"
            : downloadsInfo.remaining === 0 && !downloadsInfo.hasUnlimited
              ? lang ==="zh"
                ?"购买下载"
                :"Buy & Download"
              : downloadsInfo.hasUnlimited
                ? lang ==="zh"
                  ?"下载字体"
                  :"Download Font"
                : lang ==="zh"
                  ? `下载字体 (${downloadsInfo.remaining}/${downloadsInfo.freeLimit})`
                  : `Download Font (${downloadsInfo.remaining}/${downloadsInfo.freeLimit})`;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("backToHome", lang)}
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">{t("preview", lang)}</h2>

          <textarea
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm transition focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder={t("typeToPreview", lang)}
          />

          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
              </div>
            ) : (
              <div
                ref={previewRef}
                className="min-h-[200px] break-words text-3xl leading-relaxed text-zinc-900"
                style={{
                  fontFamily: fontLoaded ? `"${fontFamily}"` :"inherit",
                }}
              >
                {previewText || (
                  <span className="text-zinc-300">
                    {t("typeToPreview", lang)}
                  </span>
                )}
              </div>
            )}
          </div>

          {fontLoaded && (
            <div className="mt-6 space-y-2">
              <p className="text-xs text-zinc-400">
                {lang ==="zh" ?"字体大小预览" :"Font size preview"}
              </p>
              <div className="space-y-3">
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 16 }} className="text-zinc-900">
                  16px - 中文字体展示 Chinese Font Display
                </p>
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 24 }} className="text-zinc-900">
                  24px - 中文字体展示 Chinese Font Display
                </p>
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 32 }} className="text-zinc-900">
                  32px - 中文字体展示
                </p>
                <p style={{ fontFamily: `"${fontFamily}"`, fontSize: 48 }} className="text-zinc-900">
                  48px - 字体展示
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
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
                <span className="text-7xl text-zinc-300">
                  {font.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{displayName}</h1>
              {font.tag ==="no_cover" && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500">
                  {t("noCoverTag", lang)}
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("category", lang)}</span>
                <span>{lang ==="zh" ? font.categoryZh : font.categoryEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("vendor", lang)}</span>
                <span>{vendors[font.vendor]?.[lang] || font.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("status", lang)}</span>
                <span>
                  {font.tag ==="no_cover" ? t("noCoverTag", lang) : t("perfect", lang)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t("fontFile", lang)}</span>
                <span className="truncate max-w-[180px] text-right">
                  {font.name}.ttf
                </span>
              </div>
            </div>

            {fontUrl && (
              <>
                <button
                  onClick={handleDownload}
                  disabled={checkingOut || authLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#e6dfd8] bg-transparent px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 disabled:opacity-60"
                >
                  {checkingOut ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                      {lang ==="zh" ?"处理中..." :"Processing..."}
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      {buttonLabel}
                    </>
                  )}
                </button>

                {user && !downloadsInfo?.hasUnlimited && (
                  <button
                    onClick={handleUnlimitedPurchase}
                    disabled={checkingUnlimited}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE3C7] px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-[#f5d0a8] disabled:opacity-60"
                  >
                    {checkingUnlimited ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        {lang ==="zh" ?"处理中..." :"Processing..."}
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {lang ==="zh" ?"无限制下载" :"Unlimited Downloads"}
                        <span className="ml-1 opacity-60">$7.99</span>
                      </>
                    )}
                  </button>
                )}

                {user && downloadsInfo?.hasUnlimited && (
                  <p className="text-center text-xs text-green-600">
                    {lang ==="zh" ?"永久无限制会员" :"Unlimited Member"}
                  </p>
                )}

                {user && fontOwned && !downloadsInfo?.hasUnlimited && (
                  <p className="text-center text-xs text-blue-600">
                    {lang ==="zh"
                      ?"你已拥有此字体，可随时免费下载"
                      :"You own this font - free to download anytime"}
                  </p>
                )}

                {!user && !authLoading && (
                  <p className="text-center text-xs text-zinc-400">
                    {lang ==="zh"
                      ?"登录后可免费下载3款字体"
                      :"Sign in for 3 free downloads"}
                  </p>
                )}
              </>
            )}

            {!fontUrl && (
              <p className="mt-4 text-center text-sm text-zinc-400">
                {t("previewNotAvailable", lang)}
              </p>
            )}
          </div>
        </div>
      </div>

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirect={`/fonts/${encodeURIComponent(font.id)}`}
      />
      <PurchaseModal
        open={showPurchaseModal}
        fontId={font.id}
        fontName={font.name}
        onClose={() => setShowPurchaseModal(false)}
      />
    </div>
  );
}
