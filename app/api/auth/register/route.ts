import { NextRequest, NextResponse } from 'next/server';
import { localDB } from '@/lib/localDB';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, age, gender, bio } = await req.json();

    // Validate
    if (!name || !email || !password || !age) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingProfile = localDB.getProfileByEmail(email);
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Email đã được đăng ký' },
        { status: 400 }
      );
    }

    // Create avatar
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=${
      gender === 'female' ? 'ffd5dc' : 'c0aede'
    }`;

    // Create profile
    const profile = {
      id: 'user_' + Date.now(),
      name,
      email,
      password, // Store password for simple login
      age: parseInt(age),
      gender,
      bio: bio || '',
      avatar,
      createdAt: new Date().toISOString(),
    };

    // Save to LocalStorage via localDB
    localDB.saveProfile(profile);

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
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
