import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'meta_accounts_center_super_secret_jwt_key_2026_redsoftware'
);

export interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  is2FAEnabled?: boolean;
  passwordHash?: string;
  sessionId?: string;
  [key: string]: any;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as JWTPayload;
  } catch (err) {
    return null;
  }
}

export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
  const authHeader = req.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('token')?.value || null;
  }

  if (!token) return null;
  return await verifyToken(token);
}
