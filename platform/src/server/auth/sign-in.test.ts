import { describe, expect, it, vi } from 'vitest';
import { getDb } from '@/server/db';
import { consumeAdminSignIn, requestAdminSignIn } from '@/server/auth/sign-in';
import type { SignInEnv } from '@/server/auth/config';

const databaseReady = Boolean(process.env.DATABASE_URL);
const env: SignInEnv = {
  AUTH_SECRET: 'sign-in-test-secret',
  ADMIN_EMAILS: 'owner@example.com',
  APP_ORIGIN: 'https://admin.example.com',
  EMAIL_FROM: 'Angela-Maria <studio@example.com>',
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
};

describe('admin magic links', () => {
  it.skipIf(!databaseReady)('emails only an allowlisted address and consumes the link once', async () => {
    const db = getDb();
    const sent: string[] = [];
    const mailer = {
      sendSignInLink: vi.fn(async (_to: string, url: string) => {
        sent.push(url);
      }),
    };
    try {
      const ignored = await requestAdminSignIn({
        db,
        env,
        mailer,
        email: ' Intruder@Example.com ',
      });
      expect(ignored).toBe('accepted');
      expect(mailer.sendSignInLink).not.toHaveBeenCalled();

      const accepted = await requestAdminSignIn({
        db,
        env,
        mailer,
        email: ' Owner@Example.com ',
      });
      expect(accepted).toBe('accepted');
      expect(mailer.sendSignInLink).toHaveBeenCalledOnce();
      const token = new URL(sent[0]).searchParams.get('token') ?? '';
      const stored = await db.adminSignInChallenge.findFirstOrThrow({ where: { email: 'owner@example.com' } });
      expect(stored.tokenHash).not.toBe(token);
      expect(stored.tokenHash.includes(token)).toBe(false);
      const first = await consumeAdminSignIn({ db, env, token });
      expect(first?.cookie).toContain('HttpOnly');
      expect(first?.cookie).toContain('SameSite=Lax');
      expect(first?.cookie).not.toContain(token);
      expect(await consumeAdminSignIn({ db, env, token })).toBeNull();
    } finally {
      await db.adminSignInChallenge.deleteMany({
        where: { email: { in: ['owner@example.com', 'intruder@example.com'] } },
      });
    }
  });

  it.skipIf(!databaseReady)('does not keep a challenge when the message cannot be sent', async () => {
    const db = getDb();
    const result = await requestAdminSignIn({
      db,
      env,
      mailer: {
        sendSignInLink: async () => {
          throw new Error('mailbox refused');
        },
      },
      email: 'owner@example.com',
    });
    expect(result).toBe('send_failed');
    expect(await db.adminSignInChallenge.count({ where: { email: 'owner@example.com' } })).toBe(0);
  });

  it.skipIf(!databaseReady)('rejects expired, malformed, unknown, and repeated tokens, including a race', async () => {
    const db = getDb();
    const issuedAt = 1_700_000_000_000;
    try {
      expect(await consumeAdminSignIn({ db, env, token: '' })).toBeNull();
      expect(await consumeAdminSignIn({ db, env: { ...env, AUTH_SECRET: undefined }, token: 'abc' })).toBeNull();
      expect(await consumeAdminSignIn({ db, env, token: 'not a token' })).toBeNull();
      expect(await consumeAdminSignIn({ db, env, token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })).toBeNull();

      const sent: string[] = [];
      const capture = {
        sendSignInLink: vi.fn(async (_to: string, url: string) => {
          sent.push(url);
        }),
      };
      await requestAdminSignIn({ db, env, mailer: capture, email: 'owner@example.com', now: issuedAt });
      const expired = new URL(sent[0]).searchParams.get('token') ?? '';
      expect(await consumeAdminSignIn({ db, env, token: expired, now: issuedAt + 15 * 60 * 1000 })).toBeNull();

      sent.length = 0;
      await requestAdminSignIn({ db, env, mailer: capture, email: 'owner@example.com', now: issuedAt });
      const current = new URL(sent[0]).searchParams.get('token') ?? '';
      const [first, second] = await Promise.all([
        consumeAdminSignIn({ db, env, token: current, now: issuedAt + 1_000 }),
        consumeAdminSignIn({ db, env, token: current, now: issuedAt + 1_000 }),
      ]);
      expect([first, second].filter((result) => result !== null)).toHaveLength(1);

      sent.length = 0;
      await requestAdminSignIn({ db, env, mailer: capture, email: 'owner@example.com', now: issuedAt });
      const removed = new URL(sent[0]).searchParams.get('token') ?? '';
      expect(await consumeAdminSignIn({ db, env: { ...env, ADMIN_EMAILS: '' }, token: removed, now: issuedAt + 1_000 })).toBeNull();
      expect(await consumeAdminSignIn({ db, env, token: removed, now: issuedAt + 1_000 })).toBeNull();
    } finally {
      await db.adminSignInChallenge.deleteMany({ where: { email: 'owner@example.com' } });
    }
  });
});
