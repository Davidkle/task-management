import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { withUser } from '@/lib/withUser';

const CategoryUpdateSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

type Params = {
  params: {
    id: string;
  };
};

export const PUT = withUser(async (req: NextRequest, user: { id: string }, { params }: Params) => {
  try {
    const paramsData = await params;
    const body = await req.json();
    const parsed = CategoryUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: parsed.error.flatten() } },
        { status: 400 }
      );
    }
    const category = await prisma.category.update({ where: { id: paramsData.id, userId: user.id }, data: parsed.data });
    return NextResponse.json({ success: true, data: category });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});

export const DELETE = withUser(async (req: NextRequest, user: { id: string }, { params }: Params) => {
  try {
    await prisma.category.delete({ where: { id: params.id, userId: user.id } });
    return NextResponse.json({ success: true, data: {} });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
});
