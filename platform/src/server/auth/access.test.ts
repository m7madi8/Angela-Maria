import { describe, expect, it } from 'vitest';
import { accessFromToken, parseAllowlist } from '@/server/auth/access';
import { isSignInConfigured } from '@/server/auth/config';
import { adminCookieOptions, signSession, verifySession } from '@/server/auth/session';

const secret = 'test-secret-not-used-outside-tests';

const configured = {
  AUTH_SECRET: secret,
  EMAIL_FROM: 'Angela-Maria <studio@example.com>',
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'studio@example.com',
  SMTP_PASSWORD: 'mailbox-password',
  APP_ORIGIN: 'https://admin.example.com',
  ADMIN_EMAILS: 'owner@example.com',
  NODE_ENV: 'production',
};

describe('admin sessions', () => {
  it('opens sign-in only when SMTP, origin, secret, and the allowlist are set', () => {
    expect(isSignInConfigured({ NODE_ENV: 'development', AUTH_DEV_LOGIN: 'true' })).toBe(false);
    expect(isSignInConfigured({ ...configured, SMTP_HOST: undefined, AUTH_DEV_LOGIN: 'true' })).toBe(false);
    expect(isSignInConfigured({ ...configured, APP_ORIGIN: 'http://localhost:3000' })).toBe(false);
    expect(isSignInConfigured({ ...configured, ADMIN_EMAILS: '' })).toBe(false);
    expect(isSignInConfigured({ ...configured, SMTP_PASSWORD: undefined })).toBe(false);
    expect(isSignInConfigured(configured)).toBe(true);
    expect(isSignInConfigured({ ...configured, NODE_ENV: 'development', APP_ORIGIN: 'http://127.0.0.1:3000' })).toBe(true);
  });

  it('compares the browser origin with the Host header', async () => {
    const { isSameOrigin } = await import('@/server/auth/config');
    const allowed = new Request('http://localhost:3000/api/admin/session', {
      headers: { origin: 'http://127.0.0.1:3010', host: '127.0.0.1:3010' },
    });
    const blocked = new Request('http://127.0.0.1:3010/api/admin/session', {
      headers: { origin: 'https://evil.example', host: '127.0.0.1:3010' },
    });
    expect(isSameOrigin(allowed)).toBe(true);
    expect(isSameOrigin(blocked)).toBe(false);
  });

  it('sets a host-only cookie policy', () => {
    expect(adminCookieOptions({ NODE_ENV: 'production' })).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });
    expect(adminCookieOptions({ NODE_ENV: 'development' }).secure).toBe(false);
  });

  it('rejects a missing secret, a bad signature, and an expired token', async () => {
    const token = await signSession('owner@example.com', secret, 1_700_000_000_000);
    expect(await verifySession(token, '')).toBeNull();
    expect(await verifySession(`${token}x`, secret)).toBeNull();
    expect(await verifySession(token, 'other-secret')).toBeNull();
    expect(await verifySession(token, secret, 1_700_000_000_000 + 13 * 60 * 60 * 1000)).toBeNull();
  });

  it('allows only an allowlisted email', async () => {
    const now = 1_700_000_000_000;
    const token = await signSession('Owner@Example.com', secret, now);
    expect(parseAllowlist(' Owner@Example.com , other@example.com ').has('owner@example.com')).toBe(true);

    expect(await accessFromToken(null, { AUTH_SECRET: secret, ADMIN_EMAILS: 'owner@example.com' }, now)).toMatchObject({
      status: 401,
    });
    expect(await accessFromToken(token, { ADMIN_EMAILS: 'owner@example.com' }, now)).toMatchObject({
      reason: 'misconfigured',
    });
    expect(await accessFromToken(token, { AUTH_SECRET: secret, ADMIN_EMAILS: '' }, now)).toMatchObject({
      status: 403,
    });
    expect(await accessFromToken(token, { AUTH_SECRET: secret, ADMIN_EMAILS: 'other@example.com' }, now)).toMatchObject({
      status: 403,
    });
    expect(await accessFromToken(token, { AUTH_SECRET: secret, ADMIN_EMAILS: 'owner@example.com' }, now)).toEqual({
      ok: true,
      email: 'owner@example.com',
    });
  });
});
