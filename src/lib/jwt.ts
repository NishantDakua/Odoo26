import { SignJWT, jwtVerify, JWTPayload as JosePayload } from 'jose';
import { JWTPayload } from '@/types';

// Ensure the secret is available and encode it for jose
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const secret = new TextEncoder().encode(JWT_SECRET);

export async function signToken(
  payload: JWTPayload,
  expiresIn: string = '24h'
): Promise<string> {
  return await new SignJWT(payload as unknown as JosePayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}
