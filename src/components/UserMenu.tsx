"use client";

import { useLanguage } from"./LanguageProvider";
import { t } from"@/lib/i18n";
import { createClient } from"@/lib/supabase/client";
import { useRouter } from"next/navigation";
import Image from"next/image";
import { useState, useEffect, useCallback } from"react";
import LoginModal from"./LoginModal";
import type { User } from"@supabase/supabase-js";

interface DownloadsInfo {
  freeDownloadsUsed: number;
  freeLimit: number;
  hasUnlimited: boolean;
  remaining: number |"unlimited";
}

export function UserMenu() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [downloadsInfo, setDownloadsInfo] = useState<DownloadsInfo | null>(null);

  const fetchDownloadsInfo = useCallback(() => {
    fetch("/api/user/downloads")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setDownloadsInfo(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        setShowLoginModal(false);
        router.refresh();
      } else {
        setDownloadsInfo(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDownloadsInfo(null);
    router.refresh();
  };

  const statusLabel = downloadsInfo
    ? downloadsInfo.hasUnlimited
      ?"Unlimited"
      : `${typeof downloadsInfo.remaining ==="number" ? downloadsInfo.remaining : downloadsInfo.freeLimit}/${downloadsInfo.freeLimit}`
    :"";

  return (
    <div className="flex items-center gap-3">
      {!loading && (
        <>
          {user ? (
            <div className="group relative">
              <button className="relative flex items-center gap-2 rounded-full p-0.5 transition-colors hover:ring-2 hover:ring-zinc-200">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name ??"Avatar"}
                    width={32}
                    height={32}
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-600">
                    {(user.user_metadata?.full_name ?? user.email ??"U").charAt(0).toUpperCase()}
                  </div>
                )}
                {downloadsInfo?.hasUnlimited && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white ring-2 ring-white">
                    ∞
                  </span>
                )}
                {downloadsInfo && !downloadsInfo.hasUnlimited && downloadsInfo.freeDownloadsUsed > 0 && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {Math.max(0, downloadsInfo.freeLimit - downloadsInfo.freeDownloadsUsed)}
                  </span>
                )}
              </button>

              <div className="invisible absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-200 bg-white py-1.5 shadow-lg opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="px-4 py-2">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {user.user_metadata?.full_name ?? user.email}
                  </p>
                  {downloadsInfo && (
                    <p
                      className={`mt-0.5 text-xs font-medium ${
                        downloadsInfo.hasUnlimited
                          ?"text-green-600"
                          :"text-zinc-500"
                      }`}
                    >
                      {downloadsInfo.hasUnlimited
                        ? t("unlimitedBadge", lang)
                        : `Limited ${statusLabel}`}
                    </p>
                  )}
                </div>
                <div className="mx-4 my-1.5 border-t border-zinc-100" />
                <button
                  onClick={() => router.push("/downloads")}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t("downloadHistory", lang)}
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-zinc-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  {t("signOut", lang)}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50"
            >
              {t("signIn", lang)}
            </button>
          )}
        </>
      )}

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
