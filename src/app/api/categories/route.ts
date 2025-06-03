import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withUser } from '@/lib/withUser';

const CategoryCreateSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string().optional(),
});

export const GET = withUser(async (req: NextRequest, user: { id: string }) => {
  // TODO: Need to add pagination
  const categories = await prisma.category.findMany({ where: { userId: user.id } });
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
    const category = await prisma.category.create({ data: { ...parsed.data, userId: user.id } });
    return NextResponse.json({ success: true, data: category });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});
