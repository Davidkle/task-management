import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET: Return all user profiles for active sessions, with an 'active' boolean
export async function GET(request: NextRequest) {
  // Get all sessions for the current user
  const sessions = await auth.api.listSessions({ headers: request.headers });
  if (!sessions || !Array.isArray(sessions)) {
    return NextResponse.json({ error: 'No sessions found' }, { status: 401 });
  }

  // Get the current active session
  const currentSession = await auth.api.getSession({ headers: request.headers });
  const activeToken = currentSession?.session?.token;

  // Get user IDs from sessions
  const userIds = sessions.map((s) => s.userId);

  // Fetch users from DB
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });

  // Map users to sessions, add 'active' boolean
  const profiles = users.map((user) => {
    const session = sessions.find((s) => s.userId === user.id);
    return {
      ...user,
      active: session?.token === activeToken,
      sessionToken: session?.token,
    };
  });

  return NextResponse.json({ profiles });
}
