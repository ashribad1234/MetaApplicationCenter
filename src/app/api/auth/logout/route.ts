import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseDeviceInfo } from '@/lib/userAgentParser';
import { logActivity } from '@/lib/activityLogger';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    const deviceInfo = parseDeviceInfo(req);

    if (authUser && authUser.sessionId) {
      await prisma.userSession.deleteMany({
        where: { id: authUser.sessionId },
      });

      await logActivity({
        userId: authUser.userId,
        actionType: 'LOGOUT',
        description: 'Logged out of current session',
        ipAddress: deviceInfo.ipAddress,
        deviceName: deviceInfo.deviceName,
        browser: deviceInfo.browser,
      });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
