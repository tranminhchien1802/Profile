import { NextRequest, NextResponse } from 'next/server';
import { localDB } from '@/lib/localDB';

// GET: Check if user is logged in
export async function GET(req: NextRequest) {
  try {
    const currentUserJson = req.cookies.get('dating_current_user')?.value;
    
    if (!currentUserJson) {
      return NextResponse.json({ user: null });
    }

    const user = JSON.parse(currentUserJson);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}
