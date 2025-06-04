import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withUser } from '@/lib/withUser';
import { PaginatedResponse, TaskWithCategory } from '@/lib/types';

const DEFAULT_POSITION = 1_000;

const TaskCreateSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  categoryId: z.string().optional(),
});

export const GET = withUser(async (req: NextRequest, user: { id: string }) => {
  // Parse query params for pagination
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 25);
  const limit = parseInt(searchParams.get('limit') || '25', 25);
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await prisma.task.count({
    where: { userId: user.id },
  });

  // Get paginated tasks
  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { position: 'desc' },
    include: {
      category: {
        select: {
          id: true,
        },
      },
    },
    skip,
    take: limit,
  });

  const paginatedResponse: PaginatedResponse<TaskWithCategory> = {
    data: tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Build paginated response
  return NextResponse.json(paginatedResponse);
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

    const lastTask = await prisma.task.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'desc' },
    });

    const nextPosition = lastTask?.position ? lastTask.position + 1 : DEFAULT_POSITION;

    const task = await prisma.task.create({ data: { ...parsed.data, userId: user.id, position: nextPosition } });
    return NextResponse.json({ success: true, data: task });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});
