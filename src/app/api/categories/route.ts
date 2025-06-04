import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withUser } from '@/lib/withUser';

const CategoryCreateSchema = z.object({
  name: z.string(),
  color: z.string(),
});

const DEFAULT_POSITION = 1_000;

export const GET = withUser(async (req: NextRequest, user: { id: string }) => {
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    orderBy: { position: 'desc' },
  });
  return NextResponse.json({ success: true, data: categories });
});

export const POST = withUser(async (req: NextRequest, user: { id: string }) => {
  try {
    const body = await req.json();
    const parsed = CategoryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    const lastCategory = await prisma.category.findFirst({
      where: { userId: user.id },
      orderBy: { position: 'desc' },
    });

    const nextPosition = lastCategory?.position ? lastCategory.position + DEFAULT_POSITION : DEFAULT_POSITION;

    const category = await prisma.category.create({
      data: { ...parsed.data, userId: user.id, position: nextPosition },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});
