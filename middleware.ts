import { NextResponse, NextRequest } from 'next/server';

//로그인 없이 접근 불가능한 페이지
const blockRouteList = ['/workspace', '/mypage'];

export function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.clone();
  const nextPath = nextUrl.pathname;

  console.log('middleware', nextPath, nextUrl);
  return NextResponse.redirect(new URL('/auth/login', request.url));
  
  // if (blockRouteList.some(route => nextPath.includes(route))) {
  //   const accessToken = localStorage.getItem('accessToken');
    
  //   console.log('middleware', accessToken, nextPath, nextUrl);
    
  //   if (!accessToken) {
  //     nextPath.pathname = '/auth/login';
  //     return NextResponse.redirect(nextUrl);
  //   }
  // }
}

// export const config = {
//   matcher: ['/workspace/:path*', '/mypage'],
// };
