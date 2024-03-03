import { NextResponse, NextRequest } from 'next/server';

//로그인 없이 접근 불가능한 페이지
const blockRouteList = ['/workspace', '/mypage'];

export function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  const nextPath = nextUrl.pathname;

  if (blockRouteList.some((route) => nextPath.includes(route))) {
    const accessToken = request.cookies;
    if (!accessToken) {
      // return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
}
