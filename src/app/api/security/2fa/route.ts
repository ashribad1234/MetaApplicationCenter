import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseDeviceInfo } from '@/lib/userAgentParser';
import { logActivity } from '@/lib/activityLogger';

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { enable } = body;

    const user = await prisma.user.update({
      where: { id: authUser.userId },
      data: { is2FAEnabled: Boolean(enable) },
      select: { id: true, is2FAEnabled: true },
    });

    const deviceInfo = parseDeviceInfo(req);
    await logActivity({
      userId: authUser.userId,
      actionType: '2FA_TOGGLE',
      description: `${user.is2FAEnabled ? 'Enabled' : 'Disabled'} Two-Factor Authentication (2FA)`,
      ipAddress: deviceInfo.ipAddress,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
    });

    return NextResponse.json({
      message: `Two-Factor Authentication ${user.is2FAEnabled ? 'enabled' : 'disabled'} successfully`,
      is2FAEnabled: user.is2FAEnabled,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update 2FA settings' }, { status: 500 });
  }
}
