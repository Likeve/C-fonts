import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAssetUrl } from "@/lib/assets";

const FREE_LIMIT = 3;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const [{ data: downloads }, { data: planData }] = await Promise.all([
    supabase
      .from("user_downloads")
      .select("font_id")
      .eq("user_id", user.id),
    supabase
      .from("user_plans")
      .select("plan")
      .eq("user_id", user.id)
      .single(),
  ]);

  const hasUnlimited = planData?.plan === "unlimited";
  const freeDownloadsUsed = downloads?.length ?? 0;
  const remaining = hasUnlimited ? "unlimited" : Math.max(0, FREE_LIMIT - freeDownloadsUsed);

  return NextResponse.json({
    freeDownloadsUsed,
    freeLimit: FREE_LIMIT,
    hasUnlimited,
    remaining,
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

  // Check if already downloaded this font
  const { data: existing } = await supabase
    .from("user_downloads")
    .select("id")
    .eq("user_id", user.id)
    .eq("font_id", fontId)
    .single();

  if (existing) {
    // Already downloaded, allow re-download without counting
    const fontPath = `fonts/${fontId}.ttf`;
    const downloadUrl = getAssetUrl(fontPath);
    return NextResponse.json({
      success: true,
      downloadUrl,
      reDownload: true,
    });
  }

  // Check plan and remaining downloads
  const { data: planData } = await supabase
    .from("user_plans")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const hasUnlimited = planData?.plan === "unlimited";

  if (!hasUnlimited) {
    const { count } = await supabase
      .from("user_downloads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= FREE_LIMIT) {
      return NextResponse.json(
        { error: "no_free_downloads", freeDownloadsUsed: count },
        { status: 402 }
      );
    }
  }

  // Record the download
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
