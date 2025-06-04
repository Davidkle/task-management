import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // Get all sessions for the current user
  const sessions = await auth.api.listSessions({ headers: request.headers });
  if (!sessions || !Array.isArray(sessions)) {
    return NextResponse.json({ error: 'No sessions found' }, { status: 401 });
  }

  // Find the session for the given userId
  const session = sessions.find((s) => s.userId === userId);
  if (!session) {
    return NextResponse.json({ error: 'Session for user not found' }, { status: 404 });
  }

  // Set the active session
  await auth.api.setActiveSession({
    body: { sessionToken: session.token },
    headers: request.headers,
  });

  return NextResponse.json({ success: true });
}
