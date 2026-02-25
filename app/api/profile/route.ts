import { NextRequest, NextResponse } from 'next/server';
import { localDB } from '@/lib/localDB';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'my-super-secret-jwt-key-change-this-in-production'
);

// GET: Lấy profile của user hiện tại
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const profile = localDB.getProfiles().find(p => p.id === payload.userId);

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

// PUT: Cập nhật profile
export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { name, age, gender, bio } = await req.json();

    const profiles = localDB.getProfiles();
    const index = profiles.findIndex(p => p.id === payload.userId);

    if (index === -1) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    profiles[index] = {
      ...profiles[index],
      name,
      age,
      gender,
      bio,
    };

    localStorage.setItem('dating_profiles', JSON.stringify(profiles));

    return NextResponse.json({ profile: profiles[index] });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
