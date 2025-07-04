import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET: Return all user profiles for active sessions, with an 'active' boolean
export async function GET(request: NextRequest) {
  // Get all sessions for the current user
  const sessions = await auth.api.listDeviceSessions({ headers: request.headers });
  if (!sessions || !Array.isArray(sessions)) {
    return NextResponse.json({ error: 'No sessions found' }, { status: 401 });
  }

  // Get the current active session
  const currentSession = await auth.api.getSession({ headers: request.headers });
  const activeToken = currentSession?.session?.token;

  // Get user IDs from sessions
  const userIds = sessions.map((s) => s.user.id);

  // Fetch users from DB
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });

  // Map users to sessions, add 'active' boolean
  const profiles = users.map((user) => {
    // Find all sessions for this user
    const userSessions = sessions.filter((s) => s.user.id === user.id);
    // Is any session for this user the active one?
    const isActive = userSessions.some((s) => s.session.token === activeToken);

    let sessionToken: string | undefined;
    if (isActive) {
      sessionToken = userSessions.find((s) => s.session.token === activeToken)?.session.token;
    } else {
      sessionToken = userSessions[0].session.token;
    }

    return {
      ...user,
      active: isActive,
      sessionToken,
    };
  });

  return NextResponse.json({ profiles });
}
