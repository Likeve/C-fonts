"use client";

import { useState, useEffect } from"react";
import { createPortal } from"react-dom";
import Link from"next/link";
import Image from"next/image";
import { useLanguage } from"@/components/LanguageProvider";
import { getAssetUrl } from"@/lib/assets";

interface HistoryItem {
  fontId: string;
  name: string;
  englishName: string;
  fontPath: string;
  coverPath: string | null;
  downloadedAt: string;
  source:"free" |"purchased";
}

interface DownloadHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DownloadHistoryModal({ open, onClose }: DownloadHistoryModalProps) {
  const { lang } = useLanguage();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/user/downloads/history")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setItems(data.items ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(lang ==="zh" ?"zh-CN" :"en-US", {
      year:"numeric",
      month:"short",
      day:"numeric",
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-200 p-5">
          <h2 className="text-lg font-bold text-zinc-900">
            {lang ==="zh" ?"下载记录" :"Download History"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <svg className="mx-auto h-12 w-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-sm text-zinc-500">
                {lang ==="zh" ?"暂无下载记录" :"No downloads yet"}
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => {
                const cover = getAssetUrl(item.coverPath);
                const displayName = lang ==="en" ? item.englishName : item.name;

                return (
                  <li key={item.fontId}>
                    <Link
                      href={`/fonts/${encodeURIComponent(item.fontId)}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-zinc-50"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={displayName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-lg text-zinc-300">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900">
                          {displayName}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-xs text-zinc-400">
                            {formatDate(item.downloadedAt)}
                          </span>
                          {item.source ==="purchased" && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                              {lang ==="zh" ?"已购" :"Paid"}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="h-4 w-4 shrink-0 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
