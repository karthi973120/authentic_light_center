import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'authentic-light-center-sacred-rainbow-body-secret-key-2026';

// Base64Url encoding helper
function base64url(source) {
  let encoded = source.toString('base64');
  encoded = encoded.replace(/=/g, '');
  encoded = encoded.replace(/\+/g, '-');
  encoded = encoded.replace(/\//g, '_');
  return encoded;
}

// Custom simple JWT implementation to avoid external dependencies
export function signToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerEncoded = base64url(Buffer.from(JSON.stringify(header)));
  const payloadEncoded = base64url(Buffer.from(JSON.stringify(payload)));
  
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest();
  const signatureEncoded = base64url(signature);
  
  return `${signatureInput}.${signatureEncoded}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
  const signatureInput = `${headerEncoded}.${payloadEncoded}`;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest();
  const expectedSignatureEncoded = base64url(expectedSignature);
  
  if (signatureEncoded !== expectedSignatureEncoded) {
    return null;
  }
  
  try {
    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString('utf8'));
    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSubscribed: true,
        subscriptionExpiresAt: true,
      },
    });
    
    // Check if subscription has expired
    if (user && user.isSubscribed && user.subscriptionExpiresAt && new Date() > user.subscriptionExpiresAt) {
      // Auto-update expired subscription in DB
      await prisma.user.update({
        where: { id: user.id },
        data: { isSubscribed: false },
      });
      user.isSubscribed = false;
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
