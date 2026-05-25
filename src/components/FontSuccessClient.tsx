"use client";

import { useParams, useSearchParams } from"next/navigation";
import { useState, useEffect, useCallback } from"react";
import Link from"next/link";
import { useLanguage } from"@/components/LanguageProvider";
import { getAssetUrl } from"@/lib/assets";
import fontsData from"@/data/fonts.json";
import type { FontsJson } from"@/types/font";

const data = fontsData as FontsJson;

export default function FontSuccessClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = decodeURIComponent(params.id as string);
  const sessionId = searchParams.get("session_id");
  const { lang } = useLanguage();

  const [status, setStatus] = useState<"verifying" |"paid" |"error">(
    sessionId ?"verifying" :"paid"
  );

  const font = data.fonts.find((f) => f.id === id);
  const fontUrl = getAssetUrl(font?.fontPath ?? null);

  const verifyPayment = useCallback(async () => {
    if (!sessionId) {
      setStatus("paid");
      return;
    }
    try {
      const res = await fetch(`/api/verify?session_id=${sessionId}`);
      if (res.ok) {
        setStatus("paid");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId, verifyPayment]);

  if (!font) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">
          {lang ==="zh" ?"字体未找到" :"Font Not Found"}
        </h2>
        <Link
          href="/"
          className="mt-4 text-sm text-zinc-500 hover:text-zinc-800"
        >
          {lang ==="zh" ?"返回首页" :"Back to Home"}
        </Link>
      </div>
    );
  }

  const displayName = lang ==="en" ? font.englishName : font.name;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      {status ==="verifying" && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
        </div>
      )}

      {status ==="error" && (
        <>
          <h2 className="text-2xl font-bold text-zinc-900">
            {lang ==="zh" ?"支付验证失败" :"Payment Verification Failed"}
          </h2>
          <p className="mt-3 text-zinc-500">
            {lang ==="zh"
              ?"无法验证您的支付。如果您已完成支付，请联系客服。"
              :"Unable to verify your payment. If you completed payment, please contact support."}
          </p>
          <Link
            href={`/fonts/${encodeURIComponent(font.id)}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            {lang ==="zh" ?"返回字体详情" :"Back to Font"}
          </Link>
        </>
      )}

      {status ==="paid" && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">
            {lang ==="zh" ?"支付成功" :"Payment Successful"}
          </h2>
          <p className="mt-3 text-zinc-500">
            {lang ==="zh"
              ? `感谢购买 ${displayName}！点击下方按钮下载字体文件。`
              : `Thank you for purchasing ${displayName}! Click below to download.`}
          </p>
          <div className="mt-8 space-y-3">
            {fontUrl && (
              <a
                href={fontUrl}
                download={`${font.name}.ttf`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {lang ==="zh" ? `下载 ${font.name}.ttf` : `Download ${font.name}.ttf`}
              </a>
            )}
            <Link
              href={`/fonts/${encodeURIComponent(font.id)}`}
              className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {lang ==="zh" ?"返回字体详情" :"Back to Font"}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
