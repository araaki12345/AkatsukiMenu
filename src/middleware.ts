import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 現在のパスを取得
  const path = request.nextUrl.pathname;

  // 認証状態を確認
  const isAuthenticated = request.cookies.get('auth-token');

  // /admin/login 以外の /admin/* パスへのアクセスをチェック
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!isAuthenticated) {
      // 未認証の場合は /admin/login にリダイレクト
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', path);
      return NextResponse.redirect(url);
    }
  }

  // 認証済みユーザーが /admin/login にアクセスした場合
  if (path === '/admin/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: '/admin/:path*',
};