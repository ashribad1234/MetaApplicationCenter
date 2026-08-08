import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return 200 for security to prevent user enumeration
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Mock reset token generation
    const resetToken = `reset_${user.id}_${Date.now()}`;

    return NextResponse.json(
      {
        message: 'Password reset link sent to email successfully.',
        mockResetLink: `http://localhost:3000/reset-password?token=${resetToken}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process forgot password request' }, { status: 500 });
  }
}
