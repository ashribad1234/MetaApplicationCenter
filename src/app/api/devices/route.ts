import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseDeviceInfo } from '@/lib/userAgentParser';
import { logActivity } from '@/lib/activityLogger';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessions = await prisma.userSession.findMany({
      where: { userId: authUser.userId },
      orderBy: { lastActiveAt: 'desc' },
    });

    const formattedSessions = sessions.map((s) => ({
      ...s,
      isCurrentSession: s.id === authUser.sessionId,
    }));

    return NextResponse.json({ devices: formattedSessions, currentSessionId: authUser.sessionId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active devices' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const revokeAll = searchParams.get('revokeAll') === 'true';

    const deviceInfo = parseDeviceInfo(req);

    if (revokeAll) {
      // Delete all sessions except current one
      await prisma.userSession.deleteMany({
        where: {
          userId: authUser.userId,
          id: { not: authUser.sessionId },
        },
      });

      await logActivity({
        userId: authUser.userId,
        actionType: 'SESSION_REVOKED',
        description: 'Logged out of all other active device sessions',
        ipAddress: deviceInfo.ipAddress,
        deviceName: deviceInfo.deviceName,
        browser: deviceInfo.browser,
      });

      return NextResponse.json({ message: 'Logged out of all other devices successfully' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Device session ID is required' }, { status: 400 });
    }

    const sessionToRevoke = await prisma.userSession.findUnique({
      where: { id },
    });

    if (!sessionToRevoke || sessionToRevoke.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Device session not found' }, { status: 404 });
    }

    await prisma.userSession.delete({
      where: { id },
    });

    await logActivity({
      userId: authUser.userId,
      actionType: 'SESSION_REVOKED',
      description: `Revoked device session: ${sessionToRevoke.deviceName}`,
      ipAddress: deviceInfo.ipAddress,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
    });

    return NextResponse.json({ message: 'Device session revoked successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revoke device session' }, { status: 500 });
  }
}
