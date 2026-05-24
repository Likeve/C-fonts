"use client";

import { createPortal } from "react-dom";
import { useLanguage } from "@/components/LanguageProvider";

interface PurchaseModalProps {
  open: boolean;
  fontId: string;
  fontName: string;
  onClose: () => void;
}

export default function PurchaseModal({ open, fontId, fontName, onClose }: PurchaseModalProps) {
  const { lang } = useLanguage();

  if (!open) return null;

  const handleSelect = async (plan: "single" | "unlimited") => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fontId, fontName, plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {lang === "zh" ? "免费次数已用完" : "Free downloads used up"}
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {lang === "zh"
              ? "购买以下任一方案继续下载字体"
              : "Choose a plan to continue downloading fonts"}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSelect("single")}
            className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-500"
          >
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                {lang === "zh" ? "下载当前字体" : "Single Font"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {lang === "zh" ? `仅购买「${fontName}」` : `Only "${fontName}"`}
              </p>
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">$1.99</span>
          </button>

          <button
            onClick={() => handleSelect("unlimited")}
            className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-900 bg-zinc-900 p-4 text-left transition-all hover:bg-zinc-800 dark:border-zinc-100 dark:bg-zinc-100 dark:hover:bg-zinc-200"
          >
            <div>
              <p className="font-semibold text-white dark:text-zinc-900">
                {lang === "zh" ? "全网永久无限制" : "Unlimited Forever"}
              </p>
              <p className="text-xs text-zinc-300 dark:text-zinc-600">
                {lang === "zh"
                  ? "所有字体任意下载，永久有效"
                  : "Download any font, forever"}
              </p>
            </div>
            <span className="text-lg font-bold text-white dark:text-zinc-900">$7.99</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {lang === "zh" ? "暂不考虑" : "Maybe later"}
        </button>
      </div>
    </div>,
    document.body
  );
}
