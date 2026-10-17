const TOKEN_VERSION = 1;
const MAX_AGE_SECONDS = 60 * 60 * 12;

export const ADMIN_COOKIE = 'angila_admin';

type SessionPayload = {
  v: number;
  email: string;
  exp: number;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4);
  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return mismatch === 0;
}

async function sign(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return bytesToBase64Url(new Uint8Array(signature));
}

export function adminCookieOptions(env: { NODE_ENV?: string }): {
  httpOnly: true;
  sameSite: 'lax';
  secure: boolean;
  path: '/';
  maxAge: number;
} {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  };
}

export async function signSession(email: string, secret: string, now = Date.now()): Promise<string> {
  if (!secret) throw new Error('AUTH_SECRET is required to sign a session.');
  const payload: SessionPayload = {
    v: TOKEN_VERSION,
    email: email.trim().toLowerCase(),
    exp: Math.floor(now / 1000) + MAX_AGE_SECONDS,
  };
  const body = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${await sign(secret, body)}`;
}

export async function verifySession(token: string, secret: string, now = Date.now()): Promise<SessionPayload | null> {
  if (!secret) return null;
  const [body, signature, extra] = token.split('.');
  if (!body || !signature || extra) return null;
  const expected = await sign(secret, body);
  if (!safeEqual(signature, expected)) return null;
  const bytes = base64UrlToBytes(body);
  if (!bytes) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as Partial<SessionPayload>;
    if (payload.v !== TOKEN_VERSION || typeof payload.email !== 'string' || typeof payload.exp !== 'number') {
      return null;
    }
    const nowSeconds = Math.floor(now / 1000);
    if (payload.exp <= nowSeconds || payload.exp > nowSeconds + MAX_AGE_SECONDS + 60) return null;
    return { v: payload.v, email: payload.email, exp: payload.exp };
  } catch {
    return null;
  }
}

export function tokenFromCookieHeader(header: string | null): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    if (name !== ADMIN_COOKIE) continue;
    return decodeURIComponent(part.slice(separator + 1).trim());
  }
  return null;
}
