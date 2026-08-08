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

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        avatarUrl: true,
        is2FAEnabled: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, dateOfBirth, avatarUrl } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if updating email and it's taken by another user
    if (email && email.toLowerCase() !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (emailTaken) {
        return NextResponse.json({ error: 'Email address is already in use' }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        ...(name && { name }),
        ...(email && { email: email.toLowerCase() }),
        phone: phone !== undefined ? phone : existingUser.phone,
        dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : existingUser.dateOfBirth,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : existingUser.avatarUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        avatarUrl: true,
        is2FAEnabled: true,
        updatedAt: true,
      },
    });

    const deviceInfo = parseDeviceInfo(req);
    await logActivity({
      userId: authUser.userId,
      actionType: 'PROFILE_UPDATE',
      description: 'Updated profile information',
      ipAddress: deviceInfo.ipAddress,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
