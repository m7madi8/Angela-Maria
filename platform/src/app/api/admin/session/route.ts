import { parseAllowlist } from '@/server/auth/access';
import { isLocalHostSignIn, isSameOrigin, isSignInConfigured } from '@/server/auth/config';
import { createSmtpMailer } from '@/server/auth/mailer';
import { adminAttemptLimiter, clientKey } from '@/server/auth/rate-limit';
import { signSession } from '@/server/auth/session';
import { clearAdminCookie, requestAdminSignIn, serializeAdminCookie } from '@/server/auth/sign-in';
import { getDb } from '@/server/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  email: z.string().trim().email().max(320),
});

export async function POST(request: Request): Promise<Response> {
  const limit = adminAttemptLimiter.check(clientKey());
  if (!limit.ok) {
    return Response.json(
      { error: 'too_many_requests' },
      { status: 429, headers: { 'retry-after': String(Math.max(1, Math.ceil((limit.retryAt - Date.now()) / 1000))) } },
    );
  }
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'cross_origin' }, { status: 403 });
  }
  if (!isSignInConfigured(process.env)) {
    if (!isLocalHostSignIn(request, process.env)) {
      return Response.json({ error: 'sign_in_not_configured' }, { status: 403 });
    }
    let localBody: unknown;
    try {
      localBody = await request.json();
    } catch {
      return Response.json({ error: 'invalid_body' }, { status: 400 });
    }
    const localEmail = bodySchema.safeParse(localBody);
    if (!localEmail.success || !process.env.AUTH_SECRET) {
      return Response.json({ error: 'invalid_email' }, { status: 400 });
    }
    const email = localEmail.data.email.trim().toLowerCase();
    if (!parseAllowlist(process.env.ADMIN_EMAILS).has(email)) {
      return Response.json({ error: 'forbidden' }, { status: 403 });
    }
    const token = await signSession(email, process.env.AUTH_SECRET);
    return Response.json(
      { status: 'signed_in' },
      { headers: { 'set-cookie': serializeAdminCookie(token, process.env) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'invalid_email' }, { status: 400 });

  try {
    const result = await requestAdminSignIn({
      db: getDb(),
      env: process.env,
      mailer: createSmtpMailer(process.env),
      email: parsed.data.email,
    });
    if (result === 'send_failed') {
      return Response.json({ error: 'send_failed' }, { status: 503 });
    }
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }

  return Response.json({ status: 'accepted' });
}

export async function DELETE(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'cross_origin' }, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: { 'set-cookie': clearAdminCookie(process.env) },
  });
}
