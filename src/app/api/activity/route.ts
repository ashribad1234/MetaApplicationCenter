import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const actionType = searchParams.get('actionType');

    const activities = await prisma.activityLog.findMany({
      where: {
        userId: authUser.userId,
        ...(actionType ? { actionType } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}
