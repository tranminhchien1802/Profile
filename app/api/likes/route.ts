import { NextRequest, NextResponse } from 'next/server';
import { localDB, generateId } from '@/lib/localDB';

// POST: Like một profile
export async function POST(req: NextRequest) {
  try {
    const currentUserJson = req.cookies.get('dating_current_user')?.value;
    if (!currentUserJson) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = JSON.parse(currentUserJson);
    const { toUserId } = await req.json();

    if (!toUserId) {
      return NextResponse.json({ error: 'Missing toUserId' }, { status: 400 });
    }

    const fromUserId = currentUser.id;

    // Tạo like
    const like = {
      id: generateId(),
      fromUserId,
      toUserId,
      createdAt: new Date().toISOString(),
    };

    const isNewLike = localDB.saveLike(like);
    if (!isNewLike) {
      return NextResponse.json({ error: 'Đã like rồi' }, { status: 400 });
    }

    // Kiểm tra match
    const isMatch = localDB.checkMatch(fromUserId, toUserId);

    let match = null;
    let matchedProfile = null;

    if (isMatch) {
      // Tạo match mới
      const newMatch = {
        id: generateId(),
        userAId: fromUserId,
        userBId: toUserId,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };

      localDB.saveMatch(newMatch);
      match = newMatch;

      // Lấy info profile người match
      const profiles = localDB.getProfiles();
      matchedProfile = profiles.find(p => p.id === toUserId) || null;
    }

    return NextResponse.json({
      success: true,
      isMatch,
      match,
      matchedProfile,
    });
  } catch (error) {
    console.error('Like error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

// GET: Lấy danh sách likes
export async function GET(req: NextRequest) {
  try {
    const currentUserJson = req.cookies.get('dating_current_user')?.value;
    if (!currentUserJson) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = JSON.parse(currentUserJson);
    const myProfileId = currentUser.id;

    const likes = localDB.getLikes().filter(l => l.fromUserId === myProfileId);

    return NextResponse.json({ likes });
  } catch (error) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
