import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withUser } from '@/lib/withUser';
import { PaginatedResponse, TaskWithCategory } from '@/lib/types';
import { Prisma, TaskStatus } from '@prisma/client';

const DEFAULT_POSITION = 1_000;

const TaskCreateSchema = z.object({
  task: z.object({
    title: z.string(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  }),
  categoryId: z.string().optional(),
});

export const GET = withUser(async (req: NextRequest, user: { id: string }) => {
  // Parse query params for pagination, search, and filters
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 25);
  const limit = parseInt(searchParams.get('limit') || '25', 25);
  const skip = (page - 1) * limit;

  // New: search and filter params
  const search = searchParams.get('search')?.trim() || '';
  const status = searchParams.get('status') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;

  // Build Prisma where clause
  const where: Prisma.TaskWhereInput = { userId: user.id };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (status) {
    where.status = status as TaskStatus;
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }

  // Get total count for pagination (with filters)
  const total = await prisma.task.count({
    where,
  });

  // Get paginated tasks (with filters)
  const tasks = await prisma.task.findMany({
    where,
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

    const nextPosition = lastTask?.position ? lastTask.position + DEFAULT_POSITION : DEFAULT_POSITION;

    const task = await prisma.task.create({
      data: { ...parsed.data.task, categoryId: parsed.data.categoryId, userId: user.id, position: nextPosition },
      include: {
        category: {
          select: {
            id: true,
          },
        },
      },
    });
    return NextResponse.json({ success: true, data: task });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});
