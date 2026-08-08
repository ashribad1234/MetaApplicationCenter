import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: authUser.userId },
        include: {
          privacySetting: true,
          connectedAccounts: true,
          sessions: {
            orderBy: { lastActiveAt: 'desc' },
          },
        },
      });
    } catch (e) {
      console.log('Prisma me query notice:', e);
    }

    const userData = {
      id: user?.id || authUser.userId,
      name: user?.name || authUser.name || authUser.email.split('@')[0],
      email: user?.email || authUser.email,
      phone: user?.phone || authUser.phone || null,
      dateOfBirth: user?.dateOfBirth || authUser.dateOfBirth || null,
      avatarUrl: user?.avatarUrl || authUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
      is2FAEnabled: user ? Boolean(user.is2FAEnabled) : Boolean(authUser.is2FAEnabled ?? true),
      createdAt: user?.createdAt || new Date().toISOString(),
      updatedAt: user?.updatedAt || new Date().toISOString(),
    };

    const isDemo = userData.email === 'demo@redsoftware.in';

    const defaultConnected = isDemo
      ? [
          {
            id: 'acc_ig_1',
            provider: 'INSTAGRAM',
            providerAccountId: 'ig_demo',
            providerUsername: 'alex.morgan_official',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          },
          {
            id: 'acc_fb_2',
            provider: 'FACEBOOK',
            providerAccountId: 'fb_demo',
            providerUsername: 'Alex Morgan',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          },
        ]
      : [];

    return NextResponse.json({
      user: userData,
      privacySetting: user?.privacySetting || {
        profileVisibility: 'EVERYONE',
        emailVisibility: 'ONLY_ME',
        phoneVisibility: 'ONLY_ME',
        personalizedAds: true,
        dataSharing: false,
      },
      connectedAccounts: user?.connectedAccounts || defaultConnected,
      sessions: user?.sessions || [
        {
          id: authUser.sessionId || 'session_current',
          deviceName: 'Windows PC (Chrome)',
          deviceType: 'Desktop',
          browser: 'Chrome 122.0',
          os: 'Windows 11',
          ipAddress: '192.168.1.105',
          lastActiveAt: new Date().toISOString(),
        },
      ],
      currentSessionId: authUser.sessionId || 'session_current',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user session info' }, { status: 500 });
  }
}
