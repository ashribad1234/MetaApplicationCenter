import { prisma } from './prisma';

export async function logActivity(params: {
  userId: string;
  actionType:
    | 'LOGIN'
    | 'LOGOUT'
    | 'PASSWORD_CHANGE'
    | 'PROFILE_UPDATE'
    | 'ACCOUNT_CONNECTED'
    | 'ACCOUNT_DISCONNECTED'
    | 'PRIVACY_UPDATE'
    | '2FA_TOGGLE'
    | 'SESSION_REVOKED';
  description: string;
  ipAddress: string;
  deviceName: string;
  browser: string;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        actionType: params.actionType,
        description: params.description,
        ipAddress: params.ipAddress,
        deviceName: params.deviceName,
        browser: params.browser,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
