import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/data/service';
import { MOCK_USERS } from '@/lib/data/mockData';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const body = await request.json();
    const { userId, status, assigneeId, dueDate, priority, title, description } = body;

    const currentUser = MOCK_USERS.find((u) => u.id === userId);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthenticated user context' },
        { status: 401 }
      );
    }

    if (assigneeId || dueDate || priority || title || description) {
      const updatedTask = await DataService.updateTaskDetails(currentUser, taskId, {
        assigneeId,
        dueDate,
        priority,
        status,
        title,
        description,
      });
      return NextResponse.json({ success: true, data: updatedTask });
    }

    if (status) {
      const updatedTask = await DataService.updateTaskStatus(currentUser, taskId, status);
      return NextResponse.json({ success: true, data: updatedTask });
    }

    return NextResponse.json(
      { success: false, error: 'No valid update fields provided' },
      { status: 400 }
    );
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') || error.message?.includes('permission') ? 403 : 400;
    return NextResponse.json(
      { success: false, error: error.message || 'Task update failed' },
      { status }
    );
  }
}
