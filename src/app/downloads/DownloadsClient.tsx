"use client";

import { useState, useEffect } from"react";
import Link from"next/link";
import { useLanguage } from"@/components/LanguageProvider";
import { t, dateLang } from"@/lib/i18n";
import { createClient } from"@/lib/supabase/client";
import type { User } from"@supabase/supabase-js";

interface HistoryItem {
 fontId: string;
 name: string;
 englishName: string;
 downloadedAt: string;
 source:"free" |"purchased";
}

export default function DownloadsClient() {
 const { lang } = useLanguage();
 const [items, setItems] = useState<HistoryItem[]>([]);
 const [dataLoading, setDataLoading] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);
 const [user, setUser] = useState<User | null>(null);

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

 useEffect(() => {
 if (!user) return;
 setDataLoading(true);
 fetch("/api/user/downloads/history")
 .then((res) => res.json())
 .then((data) => {
 if (!data.error) setItems(data.items ?? []);
 })
 .catch(() => {})
 .finally(() => setDataLoading(false));
 }, [user]);

 const loading = authLoading || dataLoading;

 const formatDate = (iso: string) => {
 const d = new Date(iso);
 return d.toLocaleDateString(dateLang(lang), {
 year:"numeric",
 month:"short",
 day:"numeric",
 });
 };

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

 <h1 className="text-2xl font-bold text-zinc-900">
 {t("downloadHistory", lang)}
 </h1>

 {authLoading ? (
 <div className="flex items-center justify-center py-24">
 <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
 </div>
 ) : !user ? (
 <div className="py-24 text-center">
 <svg className="mx-auto h-12 w-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
 </svg>
 <p className="mt-4 text-sm text-zinc-500">
 {t("signInToViewHistory", lang)}
 </p>
 </div>
 ) : loading ? (
 <div className="flex items-center justify-center py-24">
 <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
 </div>
 ) : items.length === 0 ? (
 <div className="py-24 text-center">
 <svg className="mx-auto h-12 w-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
 </svg>
 <p className="mt-4 text-sm text-zinc-500">
 {t("noDownloadsYet", lang)}
 </p>
 <Link
 href="/"
 className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:text-zinc-600"
 >
 {t("browseFonts", lang)}
 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </Link>
 </div>
 ) : (
 <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200">
 <table className="w-full text-left text-sm">
 <thead>
 <tr className="border-b border-zinc-200 bg-zinc-50">
 <th className="px-4 py-3 font-medium text-zinc-500">
 {t("fontNameLabel", lang)}
 </th>
 <th className="px-4 py-3 font-medium text-zinc-500">
 {t("downloadedAt", lang)}
 </th>
 <th className="px-4 py-3 font-medium text-zinc-500">
 {t("source", lang)}
 </th>
 <th className="w-10 px-4 py-3" />
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-100">
 {items.map((item) => {
 const displayName = lang ==="en" ? item.englishName : item.name;

 return (
 <tr
 key={item.fontId}
 className="transition-colors hover:bg-zinc-50"
 >
 <td className="px-4 py-3">
 <Link
 href={`/fonts/${encodeURIComponent(item.fontId)}`}
 className="font-medium text-zinc-900 hover:text-zinc-600"
 >
 {displayName}
 </Link>
 </td>
 <td className="px-4 py-3 text-zinc-500">
 {formatDate(item.downloadedAt)}
 </td>
 <td className="px-4 py-3">
 {item.source ==="purchased" ? (
 <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
 {t("paid", lang)}
 </span>
 ) : (
 <span className="text-zinc-500">
 {t("free", lang)}
 </span>
 )}
 </td>
 <td className="px-4 py-3 text-right">
 <Link
 href={`/fonts/${encodeURIComponent(item.fontId)}`}
 className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-600"
 >
 {t("view", lang)}
 <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </Link>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>
 );
}
