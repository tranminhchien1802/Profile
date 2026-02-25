import { NextRequest, NextResponse } from 'next/server';
import { localDB } from '@/lib/localDB';

// GET: Lấy danh sách matches của user hiện tại
export async function GET(req: NextRequest) {
  try {
    const currentUserJson = req.cookies.get('dating_current_user')?.value;
    if (!currentUserJson) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = JSON.parse(currentUserJson);
    const myProfileId = currentUser.id;

    const matches = localDB.getMatches().filter(m =>
      m.userAId === myProfileId || m.userBId === myProfileId
    );

    // Format response với thông tin user kia
    const profiles = localDB.getProfiles();

    const formattedMatches = matches.map(match => {
      const otherUserId = match.userAId === myProfileId ? match.userBId : match.userAId;
      const otherUser = profiles.find(p => p.id === otherUserId);

      return {
        id: match.id,
        status: match.status,
        scheduledDate: match.scheduledDate,
        createdAt: match.createdAt,
        otherUser: otherUser ? {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          avatar: otherUser.avatar,
        } : null,
      };
    });

    return NextResponse.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
