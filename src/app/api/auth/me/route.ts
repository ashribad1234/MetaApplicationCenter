import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        privacySetting: true,
        connectedAccounts: true,
        sessions: {
          orderBy: { lastActiveAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        avatarUrl: user.avatarUrl,
        is2FAEnabled: user.is2FAEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      privacySetting: user.privacySetting,
      connectedAccounts: user.connectedAccounts,
      sessions: user.sessions,
      currentSessionId: authUser.sessionId,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user session info' }, { status: 500 });
  }
}
