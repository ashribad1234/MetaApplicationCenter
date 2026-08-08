import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { parseDeviceInfo } from '@/lib/userAgentParser';
import { logActivity } from '@/lib/activityLogger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, dateOfBirth } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user with default privacy settings
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300`,
        privacySetting: {
          create: {
            profileVisibility: 'EVERYONE',
            emailVisibility: 'ONLY_ME',
            phoneVisibility: 'ONLY_ME',
            personalizedAds: true,
            dataSharing: false,
          },
        },
      },
      include: {
        privacySetting: true,
      },
    });

    // Create device session
    const deviceInfo = parseDeviceInfo(req);
    const sessionToken = `session_${user.id}_${Date.now()}`;

    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: sessionToken,
        deviceName: deviceInfo.deviceName,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress: deviceInfo.ipAddress,
      },
    });

    // Log Activity
    await logActivity({
      userId: user.id,
      actionType: 'LOGIN',
      description: 'Account registered and logged in',
      ipAddress: deviceInfo.ipAddress,
      deviceName: deviceInfo.deviceName,
      browser: deviceInfo.browser,
    });

    const jwtToken = await signToken({
      userId: user.id,
      email: user.email,
      sessionId: session.id,
    });

    const response = NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          avatarUrl: user.avatarUrl,
          is2FAEnabled: user.is2FAEnabled,
        },
        token: jwtToken,
      },
      { status: 201 }
    );

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
