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

    let privacy = await prisma.privacySetting.findUnique({
      where: { userId: authUser.userId },
    });

    if (!privacy) {
      privacy = await prisma.privacySetting.create({
        data: {
          userId: authUser.userId,
          profileVisibility: 'EVERYONE',
          emailVisibility: 'ONLY_ME',
          phoneVisibility: 'ONLY_ME',
          personalizedAds: true,
          dataSharing: false,
        },
      });
    }

    return NextResponse.json({ privacy });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch privacy settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      profileVisibility,
      emailVisibility,
      phoneVisibility,
      personalizedAds,
      dataSharing,
    } = body;

    const privacy = await prisma.privacySetting.upsert({
      where: { userId: authUser.userId },
      update: {
        ...(profileVisibility && { profileVisibility }),
        ...(emailVisibility && { emailVisibility }),
        ...(phoneVisibility && { phoneVisibility }),
        ...(personalizedAds !== undefined && { personalizedAds: Boolean(personalizedAds) }),
        ...(dataSharing !== undefined && { dataSharing: Boolean(dataSharing) }),
      },
      create: {
        userId: authUser.userId,
        profileVisibility: profileVisibility || 'EVERYONE',
        emailVisibility: emailVisibility || 'ONLY_ME',
        phoneVisibility: phoneVisibility || 'ONLY_ME',
        personalizedAds: personalizedAds !== undefined ? Boolean(personalizedAds) : true,
        dataSharing: dataSharing !== undefined ? Boolean(dataSharing) : false,
      },
    });

    const deviceInfo = parseDeviceInfo(req);
    await logActivity({
      userId: authUser.userId,
      actionType: 'PRIVACY_UPDATE',
      description: 'Updated privacy preferences and visibility settings',
      ipAddress: deviceInfo.ipAddress,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
    });

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      privacy,
    });
  } catch (error) {
    console.error('Update Privacy Error:', error);
    return NextResponse.json({ error: 'Failed to update privacy settings' }, { status: 500 });
  }
}
