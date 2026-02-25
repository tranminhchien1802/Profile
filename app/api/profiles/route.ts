import { NextRequest, NextResponse } from 'next/server';
import { localDB } from '@/lib/localDB';

// GET: Lấy danh sách profiles (trừ profile của user hiện tại)
export async function GET(req: NextRequest) {
  try {
    // Get current user from cookie
    const currentUserJson = req.cookies.get('dating_current_user')?.value;
    let currentUserId = null;

    if (currentUserJson) {
      try {
        const currentUser = JSON.parse(currentUserJson);
        currentUserId = currentUser.id;
      } catch {
        // Cookie không valid, vẫn trả về profiles
      }
    }

    // Lấy tất cả profiles
    let profiles = localDB.getProfiles();

    // Nếu có user hiện tại, loại profile của họ ra
    if (currentUserId) {
      profiles = profiles.filter(p => p.id !== currentUserId);
    }

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Get profiles error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
