import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fontsData from "@/data/fonts.json";
import type { FontsJson, FontData } from "@/types/font";

const data = fontsData as FontsJson;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const [{ data: downloads }, { data: purchases }] = await Promise.all([
    supabase
      .from("user_downloads")
      .select("font_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_purchases")
      .select("font_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const fontMap = new Map<string, FontData>();
  for (const f of data.fonts) {
    fontMap.set(f.id, f);
    if (f.originalId) {
      fontMap.set(f.originalId, f);
    }
  }

  const seen = new Set<string>();
  const items: Array<{
    fontId: string;
    name: string;
    englishName: string;
    fontPath: string;
    coverPath: string | null;
    downloadedAt: string;
    source: "free" | "purchased";
  }> = [];

  for (const d of downloads ?? []) {
    if (seen.has(d.font_id)) continue;
    const font = fontMap.get(d.font_id);
    if (font) {
      seen.add(d.font_id);
      items.push({
        fontId: font.id,
        name: font.name,
        englishName: font.englishName,
        fontPath: font.fontPath,
        coverPath: font.coverPath,
        downloadedAt: d.created_at,
        source: "free",
      });
    }
  }

  for (const p of purchases ?? []) {
    if (seen.has(p.font_id)) continue;
    const font = fontMap.get(p.font_id);
    if (font) {
      seen.add(p.font_id);
      items.push({
        fontId: font.id,
        name: font.name,
        englishName: font.englishName,
        fontPath: font.fontPath,
        coverPath: font.coverPath,
        downloadedAt: p.created_at,
        source: "purchased",
      });
    }
  }

  return NextResponse.json({ items });
}
