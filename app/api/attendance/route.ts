import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data/service';
import { MOCK_USERS } from '@/lib/data/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr_partner';

    const currentUser = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

    const records = await DataService.getAttendance(currentUser);
    return NextResponse.json({
      success: true,
      data: records,
      lastUpdated: DataService.getLastUpdatedTime(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
