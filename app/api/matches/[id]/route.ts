import { NextRequest, NextResponse } from 'next/server';
import { localDB } from '@/lib/localDB';

// PUT: Cập nhật match
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUserJson = req.cookies.get('dating_current_user')?.value;
    if (!currentUserJson) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, scheduledDate } = await req.json();

    localDB.updateMatch(id, { status, scheduledDate });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update match error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    );
  }
}
