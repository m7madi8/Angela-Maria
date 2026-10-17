import { afterEach, describe, expect, it } from 'vitest';
import { GET } from '@/app/api/admin/whoami/route';
import { ADMIN_COOKIE, signSession } from '@/server/auth/session';

const secret = 'whoami-test-secret';
const previous = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
};

afterEach(() => {
  process.env.AUTH_SECRET = previous.AUTH_SECRET;
  process.env.ADMIN_EMAILS = previous.ADMIN_EMAILS;
});

describe('admin identity route', () => {
  it('rejects a direct request without a session', async () => {
    process.env.AUTH_SECRET = secret;
    process.env.ADMIN_EMAILS = 'owner@example.com';
    const response = await GET(new Request('http://127.0.0.1:3000/api/admin/whoami'));
    expect(response.status).toBe(401);
  });

  it('rejects a signed session that is not allowlisted', async () => {
    process.env.AUTH_SECRET = secret;
    process.env.ADMIN_EMAILS = 'owner@example.com';
    const token = await signSession('intruder@example.com', secret);
    const response = await GET(
      new Request('http://127.0.0.1:3000/api/admin/whoami', {
        headers: { cookie: `${ADMIN_COOKIE}=${token}` },
      }),
    );
    expect(response.status).toBe(403);
  });

  it('accepts a signed allowlisted session and fails closed without a secret', async () => {
    process.env.AUTH_SECRET = secret;
    process.env.ADMIN_EMAILS = 'owner@example.com';
    const token = await signSession('owner@example.com', secret);
    const allowed = await GET(
      new Request('http://127.0.0.1:3000/api/admin/whoami', {
        headers: { cookie: `${ADMIN_COOKIE}=${token}` },
      }),
    );
    expect(allowed.status).toBe(200);
    expect(await allowed.json()).toEqual({ ok: true, email: 'owner@example.com' });

    delete process.env.AUTH_SECRET;
    const closed = await GET(
      new Request('http://127.0.0.1:3000/api/admin/whoami', {
        headers: { cookie: `${ADMIN_COOKIE}=${token}` },
      }),
    );
    expect(closed.status).toBe(401);
  });
});
