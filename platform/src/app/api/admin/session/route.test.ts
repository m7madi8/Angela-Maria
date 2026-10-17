import { afterEach, describe, expect, it } from 'vitest';
import { POST } from '@/app/api/admin/session/route';
import { ADMIN_ATTEMPT_LIMIT, adminAttemptLimiter } from '@/server/auth/rate-limit';

const signInKeys = ['AUTH_SECRET', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'EMAIL_FROM', 'APP_ORIGIN', 'ADMIN_EMAILS'] as const;
const previous = new Map<string, string | undefined>();

describe('admin session route', () => {
  afterEach(() => {
    adminAttemptLimiter.reset();
    for (const key of signInKeys) {
      const value = previous.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  function isolateUnconfigured() {
    for (const key of signInKeys) {
      if (!previous.has(key)) previous.set(key, process.env[key]);
      delete process.env[key];
    }
  }

  function post(headers: Record<string, string> = {}) {
    return POST(
      new Request('http://127.0.0.1:3000/api/admin/session', {
        method: 'POST',
        headers: { origin: 'http://127.0.0.1:3000', ...headers },
      }),
    );
  }

  it('does not issue a cookie and closes sign-in', async () => {
    isolateUnconfigured();
    const response = await post();
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'sign_in_not_configured' });
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it('rate-limits repeated sign-in attempts', async () => {
    isolateUnconfigured();
    for (let i = 0; i < ADMIN_ATTEMPT_LIMIT; i += 1) {
      const response = await post({ 'x-forwarded-for': '203.0.113.10' });
      expect(response.status).toBe(403);
    }
    const blocked = await POST(
      new Request('http://127.0.0.1:3000/api/admin/session', {
        method: 'POST',
        headers: { 'x-forwarded-for': '203.0.113.10' },
      }),
    );
    expect(blocked.status).toBe(429);
  });

  it('signs in an allowlisted address only on localhost during development', async () => {
    const previousNode = process.env.NODE_ENV;
    const previousVercel = process.env.VERCEL_ENV;
    if (!previous.has('AUTH_SECRET')) previous.set('AUTH_SECRET', process.env.AUTH_SECRET);
    if (!previous.has('ADMIN_EMAILS')) previous.set('ADMIN_EMAILS', process.env.ADMIN_EMAILS);
    process.env.NODE_ENV = 'development';
    delete process.env.VERCEL_ENV;
    process.env.AUTH_SECRET = 'local-sign-in-test-secret';
    process.env.ADMIN_EMAILS = 'owner@example.com';
    try {
      const allowed = await POST(
        new Request('http://localhost:3001/api/admin/session', {
          method: 'POST',
          headers: {
            origin: 'http://localhost:3001',
            host: 'localhost:3001',
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email: 'owner@example.com' }),
        }),
      );
      expect(allowed.status).toBe(200);
      expect(allowed.headers.get('set-cookie')).toContain('HttpOnly');
      expect(allowed.headers.get('set-cookie')).not.toContain('Secure');

      const stranger = await POST(
        new Request('http://localhost:3001/api/admin/session', {
          method: 'POST',
          headers: {
            origin: 'http://localhost:3001',
            host: 'localhost:3001',
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email: 'stranger@example.com' }),
        }),
      );
      expect(stranger.status).toBe(403);
      expect(stranger.headers.get('set-cookie')).toBeNull();

      process.env.NODE_ENV = 'production';
      const production = await POST(
        new Request('http://localhost:3001/api/admin/session', {
          method: 'POST',
          headers: {
            origin: 'http://localhost:3001',
            host: 'localhost:3001',
            'content-type': 'application/json',
          },
          body: JSON.stringify({ email: 'owner@example.com' }),
        }),
      );
      expect(production.status).toBe(403);
      expect(production.headers.get('set-cookie')).toBeNull();
    } finally {
      process.env.NODE_ENV = previousNode;
      if (previousVercel === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = previousVercel;
    }
  });

  it('keeps one budget when each attempt presents a different forwarded address', async () => {
    isolateUnconfigured();
    for (let i = 0; i < ADMIN_ATTEMPT_LIMIT; i += 1) {
      const response = await post({ 'x-forwarded-for': `198.51.100.${i + 1}` });
      expect(response.status).toBe(403);
    }
    const blocked = await post({ 'x-forwarded-for': '198.51.100.250' });
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('set-cookie')).toBeNull();
  });
});
