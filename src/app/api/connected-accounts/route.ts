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

    const accounts = await prisma.connectedAccount.findMany({
      where: { userId: authUser.userId },
      orderBy: { connectedAt: 'desc' },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch connected accounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { provider, providerUsername } = body; // FACEBOOK | INSTAGRAM | WHATSAPP

    if (!provider || !['FACEBOOK', 'INSTAGRAM', 'WHATSAPP'].includes(provider.toUpperCase())) {
      return NextResponse.json(
        { error: 'Valid provider (FACEBOOK, INSTAGRAM, WHATSAPP) is required' },
        { status: 400 }
      );
    }

    const formattedProvider = provider.toUpperCase();
    const username = providerUsername || `${authUser.email.split('@')[0]}_${formattedProvider.toLowerCase()}`;

    // Check if already connected
    const existing = await prisma.connectedAccount.findFirst({
      where: {
        userId: authUser.userId,
        provider: formattedProvider,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A ${formattedProvider} account is already connected to your profile.` },
        { status: 400 }
      );
    }

    const newAccount = await prisma.connectedAccount.create({
      data: {
        userId: authUser.userId,
        provider: formattedProvider,
        providerAccountId: `mock_${formattedProvider.toLowerCase()}_${Date.now()}`,
        providerUsername: username,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      },
    });

    const deviceInfo = parseDeviceInfo(req);
    await logActivity({
      userId: authUser.userId,
      actionType: 'ACCOUNT_CONNECTED',
      description: `Connected ${formattedProvider} account (@${username})`,
      ipAddress: deviceInfo.ipAddress,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
    });

    return NextResponse.json(
      { message: `${formattedProvider} account connected successfully`, account: newAccount },
      { status: 201 }
    );
  } catch (error) {
    console.error('Connect Account Error:', error);
    return NextResponse.json({ error: 'Failed to connect account' }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const account = await prisma.connectedAccount.findUnique({
      where: { id },
    });

    if (!account || account.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    await prisma.connectedAccount.delete({
      where: { id },
    });

    const deviceInfo = parseDeviceInfo(req);
    await logActivity({
      userId: authUser.userId,
      actionType: 'ACCOUNT_DISCONNECTED',
      description: `Disconnected ${account.provider} account (@${account.providerUsername})`,
      ipAddress: deviceInfo.ipAddress,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
    });

    return NextResponse.json({ message: 'Account disconnected successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to disconnect account' }, { status: 500 });
  }
}
