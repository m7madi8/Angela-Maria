import type { PrismaClient } from '@prisma/client';
import { parseAllowlist } from '@/server/auth/access';
import type { SignInEnv } from '@/server/auth/config';
import type { SignInMailer } from '@/server/auth/mailer';
import { adminCookieOptions, ADMIN_COOKIE, signSession } from '@/server/auth/session';

const CHALLENGE_TTL_MS = 15 * 60 * 1000;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/g, '');
}

export function createSignInToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export async function hashSignInToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return bytesToBase64Url(new Uint8Array(digest));
}

export function serializeAdminCookie(token: string, env: { NODE_ENV?: string }): string {
  const options = adminCookieOptions(env);
  const parts = [
    `${ADMIN_COOKIE}=${encodeURIComponent(token)}`,
    `Path=${options.path}`,
    `Max-Age=${options.maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (options.secure) parts.push('Secure');
  return parts.join('; ');
}

export function clearAdminCookie(env: { NODE_ENV?: string }): string {
  const secure = env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function requestAdminSignIn(input: {
  db: PrismaClient;
  env: SignInEnv;
  mailer: SignInMailer;
  email: string;
  now?: number;
}): Promise<'accepted' | 'send_failed'> {
  if (!input.env.APP_ORIGIN) return 'send_failed';
  const email = normalizeEmail(input.email);
  const allowlist = parseAllowlist(input.env.ADMIN_EMAILS);
  if (!allowlist.has(email)) return 'accepted';

  const token = createSignInToken();
  const tokenHash = await hashSignInToken(token);
  const now = input.now ?? Date.now();
  await input.db.adminSignInChallenge.create({
    data: {
      id: crypto.randomUUID(),
      email,
      tokenHash,
      expiresAt: new Date(now + CHALLENGE_TTL_MS),
    },
  });

  const url = new URL('/api/admin/session/consume', input.env.APP_ORIGIN);
  url.searchParams.set('token', token);
  try {
    await input.mailer.sendSignInLink(email, url.toString());
  } catch {
    await input.db.adminSignInChallenge.delete({ where: { tokenHash } }).catch(() => undefined);
    return 'send_failed';
  }
  return 'accepted';
}

export async function consumeAdminSignIn(input: {
  db: PrismaClient;
  env: SignInEnv;
  token: string;
  now?: number;
}): Promise<{ cookie: string } | null> {
  if (!input.env.AUTH_SECRET || !input.token) return null;
  const tokenHash = await hashSignInToken(input.token);
  const now = new Date(input.now ?? Date.now());
  const consumed = await input.db.adminSignInChallenge.updateMany({
    where: { tokenHash, consumedAt: null, expiresAt: { gt: now } },
    data: { consumedAt: now },
  });
  if (consumed.count !== 1) return null;
  const row = await input.db.adminSignInChallenge.findUnique({ where: { tokenHash } });
  if (!row || !parseAllowlist(input.env.ADMIN_EMAILS).has(row.email)) return null;
  const session = await signSession(row.email, input.env.AUTH_SECRET, now.getTime());
  return { cookie: serializeAdminCookie(session, input.env) };
}
