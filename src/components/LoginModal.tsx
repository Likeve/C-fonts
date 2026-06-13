"use client";

import { useState } from"react";
import { createPortal } from"react-dom";
import { useLanguage } from"@/components/LanguageProvider";
import { createClient } from"@/lib/supabase/client";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  redirect?: string;
}

export default function LoginModal({ open, onClose, redirect }: LoginModalProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const next = redirect || window.location.pathname + window.location.search;
      const { error } = await supabase.auth.signInWithOAuth({
        provider:"google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message :"auth_failed");
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900">
            {lang ==="zh" ?"登录中文字体库" :"Sign in to Chinese Fonts"}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {lang ==="zh"
              ?"使用 Google 账号登录，新用户免费下载1款字体"
              :"Sign in with Google, new users get 1 free download"}
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading
            ? lang ==="zh"
              ?"正在跳转..."
              :"Redirecting..."
            : lang ==="zh"
              ?"使用 Google 账号登录"
              :"Sign in with Google"}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">
            {lang ==="zh" ?"登录失败，请重试" :"Sign in failed, please try again"}
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700"
        >
          {lang ==="zh" ?"暂不考虑" :"Maybe later"}
        </button>
      </div>
    </div>,
    document.body
  );
}
