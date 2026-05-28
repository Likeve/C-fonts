import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // 刷新过期的 session
  try {
    await supabase.auth.getUser();
  } catch {
    // 忽略 Supabase 连接错误
  }

  const pathname = request.nextUrl.pathname;
  const lang = pathname.startsWith("/en") ? "en"
    : pathname.startsWith("/zh-Hant") ? "zh-Hant"
    : "zh";
  supabaseResponse.headers.set("x-lang", lang);

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|font.svg|og|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
