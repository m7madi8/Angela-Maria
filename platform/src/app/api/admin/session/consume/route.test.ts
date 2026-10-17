import { afterEach, describe, expect, it } from 'vitest';
import { GET } from '@/app/api/admin/session/consume/route';

const previousDatabase = process.env.DATABASE_URL;

afterEach(() => {
  if (previousDatabase === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = previousDatabase;
});

describe('admin sign-in consumption', () => {
  it('does not issue a session when the database cannot be used', async () => {
    delete process.env.DATABASE_URL;
    const response = await GET(new Request('http://127.0.0.1:3000/api/admin/session/consume?token=abc&locale=ar'));
    expect(response.status).toBe(307);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
    const location = response.headers.get('location') ?? '';
    expect(new URL(location).pathname).toBe('/ar/admin/sign-in');
    expect(location).not.toContain('token=');
    expect(await response.text()).not.toContain('DATABASE_URL');
  });
});
