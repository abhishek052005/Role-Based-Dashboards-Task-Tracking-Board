import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data/service';
import { MOCK_USERS } from '@/lib/data/mockData';
import { TaskFilterOptions } from '@/lib/types';
import { can } from '@/lib/auth/permissions';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr_partner';

    const currentUser = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

    const filters: TaskFilterOptions = {
      search: searchParams.get('search') || undefined,
      assigneeId: searchParams.get('assigneeId') || undefined,
      clientId: searchParams.get('clientId') || undefined,
      status: (searchParams.get('status') as any) || undefined,
      priority: (searchParams.get('priority') as any) || undefined,
      dueFilter: (searchParams.get('dueFilter') as any) || undefined,
      sortBy: (searchParams.get('sortBy') as any) || undefined,
      sortOrder: (searchParams.get('sortOrder') as any) || undefined,
    };

    const tasks = await DataService.getTasks(currentUser, filters);
    return NextResponse.json({
      success: true,
      data: tasks,
      lastUpdated: DataService.getLastUpdatedTime(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, description, clientId, assigneeId, dueDate, priority } = body;

    const currentUser = MOCK_USERS.find((u) => u.id === userId) || MOCK_USERS[0];

    if (!can(currentUser, 'tasks:create')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have permission to create tasks.' },
        { status: 403 }
      );
    }

    const newTask = await DataService.createTask(currentUser, {
      title,
      description,
      clientId,
      assigneeId,
      dueDate,
      priority,
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create task' },
      { status: 400 }
    );
  }
}
