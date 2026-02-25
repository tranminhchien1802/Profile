import { NextRequest, NextResponse } from 'next/server';
import { localDB } from '@/lib/localDB';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      );
    }

    // Find profile by email
    const profile = localDB.getProfileByEmail(email);
    if (!profile) {
      return NextResponse.json(
        { error: 'Email chưa được đăng ký' },
        { status: 404 }
      );
    }

    // Check password
    if ((profile as any).password !== password) {
      return NextResponse.json(
        { error: 'Mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Save current user to cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      },
    });

    response.cookies.set('dating_current_user', JSON.stringify(profile), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
