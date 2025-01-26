import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // アクセストークンの存在確認
  const token = request.cookies.get("appSession")?.value;
  const isAuthPage = request.nextUrl.pathname === "/";

  // デバッグ用のログ出力（必要に応じて削除可能）
  console.log("Current path:", request.nextUrl.pathname);
  console.log("Token exists:", !!token);

  if (!token && !isAuthPage) {
    // 未ログインでログインページ以外にアクセスした場合、ログインページへリダイレクト
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isAuthPage) {
    // ログイン済みでログインページにアクセスした場合、ダッシュボードへリダイレクト
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: ["/", "/dashboard/:path*", "/dashboard"],
};
