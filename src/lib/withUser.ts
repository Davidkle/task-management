import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export function withUser(handler: (req: NextRequest, user: { id: string }, ...rest: any[]) => Promise<Response>) {
  return async function (req: NextRequest, ...rest: any[]) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }
    return handler(req, session.user, ...rest);
  };
}
