import { consumeAdminSignIn } from '@/server/auth/sign-in';
import { getDb } from '@/server/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  const locale = new URL(request.url).searchParams.get('locale') === 'ar' ? 'ar' : 'en';
  const signIn = new URL(`/${locale}/admin/sign-in`, request.url);
  signIn.searchParams.set('error', '1');

  try {
    const result = await consumeAdminSignIn({ db: getDb(), env: process.env, token });
    if (!result) return redirectWithoutToken(signIn);
    const destination = new URL(`/${locale}/admin`, request.url);
    const response = redirectWithoutToken(destination);
    response.headers.set('set-cookie', result.cookie);
    return response;
  } catch {
    return redirectWithoutToken(signIn);
  }
}

function redirectWithoutToken(destination: URL): NextResponse {
  const response = NextResponse.redirect(destination);
  response.headers.set('referrer-policy', 'no-referrer');
  return response;
}
