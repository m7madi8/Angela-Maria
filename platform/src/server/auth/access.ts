import { tokenFromCookieHeader, verifySession } from '@/server/auth/session';

export type AdminEnv = {
  AUTH_SECRET?: string;
  ADMIN_EMAILS?: string;
  NODE_ENV?: string;
  VERCEL_ENV?: string;
  AUTH_DEV_LOGIN?: string;
};

export type AdminAccess =
  | { ok: true; email: string }
  | { ok: false; status: 401 | 403; reason: 'unauthorized' | 'forbidden' | 'misconfigured' };

export function parseAllowlist(value: string | undefined): Set<string> {
  if (!value) return new Set();
  return new Set(
    value
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function accessFromToken(token: string | null, env: AdminEnv, now = Date.now()): Promise<AdminAccess> {
  if (!env.AUTH_SECRET) return { ok: false, status: 401, reason: 'misconfigured' };
  if (!token) return { ok: false, status: 401, reason: 'unauthorized' };
  const session = await verifySession(token, env.AUTH_SECRET, now);
  if (!session) return { ok: false, status: 401, reason: 'unauthorized' };
  const allowlist = parseAllowlist(env.ADMIN_EMAILS);
  if (!allowlist.has(session.email)) return { ok: false, status: 403, reason: 'forbidden' };
  return { ok: true, email: session.email };
}

export async function accessFromRequest(request: Request, env: AdminEnv, now = Date.now()): Promise<AdminAccess> {
  return accessFromToken(tokenFromCookieHeader(request.headers.get('cookie')), env, now);
}
