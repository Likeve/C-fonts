"use client";

import { useLanguage } from"./LanguageProvider";
import { t } from"@/lib/i18n";
import { UserMenu } from"./UserMenu";
import Link from"next/link";
import Image from"next/image";

export default function Header() {
  const { lang } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/font.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
          <div>
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              {t("siteTitle", lang)}
            </span>
            <p className="text-xs text-zinc-500 hidden sm:block">
              {t("siteDesc", lang)}
            </p>
          </div>
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}
