import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withUser } from '@/lib/withUser';
import prisma from '@/lib/prisma';

const TaskUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  categoryId: z.string().optional(),
  position: z.number().optional(),
});

type Params = {
  params: {
    id: string;
  };
};

export const GET = withUser(async (req: NextRequest, user: { id: string }, { params }: Params) => {
  const task = await prisma.task.findUnique({
    where: { id: params.id, userId: user.id },
    include: {
      category: true,
    },
  });
  return NextResponse.json({ success: true, data: task });
});

export const PUT = withUser(async (req: NextRequest, user: { id: string }, { params }: Params) => {
  try {
    const paramsData = await params;
    const body = await req.json();

    const parsed = TaskUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const task = await prisma.task.update({ where: { id: paramsData.id, userId: user.id }, data: parsed.data });
    return NextResponse.json({ success: true, data: task });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});

export const DELETE = withUser(async (req: NextRequest, user: { id: string }, { params }: Params) => {
  try {
    const paramsData = await params;
    await prisma.task.delete({ where: { id: paramsData.id, userId: user.id } });
    return NextResponse.json({ success: true, data: {} });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});
