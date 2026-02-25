import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple auth check - không redirect cứng
export async function middleware(request: NextRequest) {
  const currentUserJson = request.cookies.get('dating_current_user')?.value;
  const { pathname } = request.nextUrl;

  // Chỉ check auth cho /browse và /matches
  if (pathname.startsWith('/browse') || pathname.startsWith('/matches')) {
    if (!currentUserJson) {
      // Cho phép truy cập nhưng sẽ hiển thị "cần login" trong page
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/browse/:path*', '/matches/:path*'],
};
