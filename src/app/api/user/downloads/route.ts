import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAssetUrl } from "@/lib/assets";
import fontsData from "@/data/fonts.json";
import type { FontsJson } from "@/types/font";

const fonts = (fontsData as FontsJson).fonts;

function findFontPath(fontId: string): string | null {
  const font = fonts.find(
    (f) => f.id === fontId || f.originalId === fontId
  );
  return font?.fontPath ?? null;
}

function getFontDownloadUrl(fontId: string): string | null {
  const fontPath = findFontPath(fontId);
  if (!fontPath) return null;
  return getAssetUrl(fontPath);
}

const DEFAULT_FREE_LIMIT = 1;

async function getPlanData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<{ plan: string; free_download_limit?: number } | null> {
  const { data, error } = await supabase
    .from("user_plans")
    .select("plan, free_download_limit")
    .eq("user_id", userId)
    .single();

  if (!error && data) return data;

  if (error) {
    const { data: fallback } = await supabase
      .from("user_plans")
      .select("plan")
      .eq("user_id", userId)
      .single();
    return fallback as { plan: string } | null;
  }

  return null;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const [{ data: downloads }, { data: purchases }, planData] = await Promise.all([
    supabase
      .from("user_downloads")
      .select("font_id")
      .eq("user_id", user.id),
    supabase
      .from("user_purchases")
      .select("font_id")
      .eq("user_id", user.id),
    getPlanData(supabase, user.id),
  ]);

  const hasUnlimited = planData?.plan === "unlimited";
  const freeLimit = planData?.free_download_limit ?? DEFAULT_FREE_LIMIT;
  const freeDownloadsUsed = downloads?.length ?? 0;
  const remaining = hasUnlimited ? "unlimited" : Math.max(0, freeLimit - freeDownloadsUsed);

  const downloadedFontIdsRaw = downloads?.map((d) => d.font_id) ?? [];
  const purchasedFontIdsRaw = purchases?.map((p) => p.font_id) ?? [];

  // Expand IDs: include both old (Chinese) and new (English slug) IDs for backward compat
  const idMap = new Map<string, Set<string>>();
  for (const f of fonts) {
    if (!idMap.has(f.id)) idMap.set(f.id, new Set());
    idMap.get(f.id)!.add(f.id);
    if (f.originalId) {
      idMap.get(f.id)!.add(f.originalId);
      if (!idMap.has(f.originalId)) idMap.set(f.originalId, new Set());
      idMap.get(f.originalId)!.add(f.id);
      idMap.get(f.originalId)!.add(f.originalId);
    }
  }

  const downloadedFontIds = [...new Set(
    downloadedFontIdsRaw.flatMap((rawId) => [...(idMap.get(rawId) ?? [rawId])])
  )];
  const purchasedFontIds = [...new Set(
    purchasedFontIdsRaw.flatMap((rawId) => [...(idMap.get(rawId) ?? [rawId])])
  )];

  return NextResponse.json({
    freeDownloadsUsed,
    freeLimit,
    hasUnlimited,
    remaining,
    downloadedFontIds,
    purchasedFontIds,
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { fontId } = body;

  if (!fontId) {
    return NextResponse.json({ error: "Missing fontId" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("user_downloads")
    .select("id")
    .eq("user_id", user.id)
    .eq("font_id", fontId)
    .single();

  if (existing) {
    const downloadUrl = getFontDownloadUrl(fontId);
    return NextResponse.json({
      success: true,
      downloadUrl,
      reDownload: true,
    });
  }

  const { data: purchased } = await supabase
    .from("user_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("font_id", fontId)
    .single();

  if (purchased) {
    const downloadUrl = getFontDownloadUrl(fontId);
    return NextResponse.json({
      success: true,
      downloadUrl,
      reDownload: true,
    });
  }

  const planData = await getPlanData(supabase, user.id);

  const hasUnlimited = planData?.plan === "unlimited";

  if (!hasUnlimited) {
    const freeLimit = planData?.free_download_limit ?? DEFAULT_FREE_LIMIT;
    const { count } = await supabase
      .from("user_downloads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= freeLimit) {
      return NextResponse.json(
        { error: "no_free_downloads", freeDownloadsUsed: count },
        { status: 402 }
      );
    }
  }

  const { error: insertError } = await supabase
    .from("user_downloads")
    .insert({ user_id: user.id, font_id: fontId });

  if (insertError) {
    return NextResponse.json({ error: "Failed to record download" }, { status: 500 });
  }

  const fontPath = `fonts/${fontId}.ttf`;
  const downloadUrl = getAssetUrl(fontPath);

  return NextResponse.json({ success: true, downloadUrl });
}
