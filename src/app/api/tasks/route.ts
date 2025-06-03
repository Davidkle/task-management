import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withUser } from '@/lib/withUser';

const DEFAULT_POSITION = 1_000_000;

const TaskCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  categoryId: z.string().optional(),
});

export const GET = withUser(async (req: NextRequest, user: { id: string }) => {
  // TODO: Parse query params for pagination, filters, etc.
  // TODO: Filter by status and categoryId
  // TODO: Search by title and description
  const tasks = await prisma.task.findMany({ where: { userId: user.id } });
  return NextResponse.json({ success: true, data: [] });
});

export const POST = withUser(async (req: NextRequest, user: { id: string }) => {
  try {
    const body = await req.json();
    const parsed = TaskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: parsed.error.flatten() } },
        { status: 400 }
      );
    }
    const task = await prisma.task.create({ data: { ...parsed.data, userId: user.id, position: DEFAULT_POSITION } });
    return NextResponse.json({ success: true, data: task });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});
