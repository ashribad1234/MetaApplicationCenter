import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { parseDeviceInfo } from '@/lib/userAgentParser';
import { logActivity } from '@/lib/activityLogger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

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

    await logActivity({
      userId: user.id,
      actionType: 'LOGIN',
      description: `Logged in from ${deviceInfo.deviceName}`,
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
        message: 'Login successful',
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
      { status: 200 }
    );

    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}
