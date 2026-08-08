import { NextRequest } from 'next/server';

export interface DeviceInfo {
  deviceName: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  os: string;
  ipAddress: string;
}

export function parseDeviceInfo(req: NextRequest): DeviceInfo {
  const userAgent = req.headers.get('user-agent') || 'Unknown Device';
  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  let os = 'Windows';
  if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
  else if (userAgent.includes('Linux')) os = 'Linux';

  let browser = 'Chrome';
  if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Edg')) browser = 'Edge';

  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    deviceType = 'Mobile';
  } else if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
    deviceType = 'Tablet';
  }

  const deviceName = `${os} (${browser})`;

  return {
    deviceName,
    deviceType,
    browser,
    os,
    ipAddress,
  };
}
