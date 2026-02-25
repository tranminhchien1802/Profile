import { NextRequest, NextResponse } from 'next/server';
import { localDB, generateId } from '@/lib/localDB';

// GET: Lấy availabilities của match
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: matchId } = await params;
    const availabilities = localDB.getAvailabilities().filter(a => a.matchId === matchId);

    return NextResponse.json({ availabilities });
  } catch (error) {
    console.error('Get availabilities error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}

// POST: Tạo/cập nhật availability
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUserJson = req.cookies.get('dating_current_user')?.value;
    if (!currentUserJson) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = JSON.parse(currentUserJson);
    const { id: matchId } = await params;
    const { date, startTime, endTime } = await req.json();

    const myUserId = currentUser.id;

    // Validate thời gian
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'Giờ bắt đầu phải trước giờ kết thúc' },
        { status: 400 }
      );
    }

    // Tạo availability
    const availability = {
      id: generateId(),
      matchId,
      userId: myUserId,
      date,
      startTime,
      endTime,
      createdAt: new Date().toISOString(),
    };

    localDB.saveAvailability(availability);

    // Kiểm tra xem đối phương đã chọn availability chưa
    const match = localDB.getMatches().find(m => m.id === matchId);
    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    const otherUserId = match.userAId === myUserId ? match.userBId : match.userAId;
    const otherAvailability = localDB.getAvailabilityByMatchAndUser(matchId, otherUserId);

    let result: any = {
      success: true,
      availability,
      isMatch: false,
      commonSlot: null,
    };

    if (otherAvailability) {
      // Cả hai đã chọn, tìm slot trùng
      const commonSlot = localDB.findCommonSlot(availability, otherAvailability);

      if (commonSlot) {
        result.isMatch = true;
        result.commonSlot = commonSlot;

        // Cập nhật match với scheduled date
        const scheduledDate = `${commonSlot.startTime} - ${commonSlot.endTime}`;
        localDB.updateMatch(matchId, {
          status: 'scheduled',
          scheduledDate,
        });
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Save availability error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
