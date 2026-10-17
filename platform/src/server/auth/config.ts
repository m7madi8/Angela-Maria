import { parseAllowlist, type AdminEnv } from '@/server/auth/access';

export type SignInEnv = AdminEnv & {
  EMAIL_FROM?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASSWORD?: string;
  APP_ORIGIN?: string;
};

function originAllowed(value: string, env: SignInEnv): boolean {
  let origin: URL;
  try {
    origin = new URL(value);
  } catch {
    return false;
  }
  if (origin.protocol !== 'https:' && origin.protocol !== 'http:') return false;
  const production = env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production';
  if (production && origin.protocol !== 'https:') return false;
  return true;
}

/**
 * Magic-link sign-in is available only when SMTP, the public origin, the session
 * secret, and at least one allowlisted administrator are all configured.
 * AUTH_DEV_LOGIN is ignored.
 */
/**
 * Development on this computer can open administration for an allowlisted
 * address when email delivery is not configured. Production never can.
 */
export function isLocalHostSignIn(request: Request, env: SignInEnv): boolean {
  if (env.NODE_ENV !== 'development' || env.VERCEL_ENV === 'production') return false;
  if (!env.AUTH_SECRET || parseAllowlist(env.ADMIN_EMAILS).size === 0) return false;
  const host = (request.headers.get('host') ?? '').replace(/:\d+$/, '').toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1';
}

export function isSignInConfigured(env: SignInEnv): boolean {
  if (!env.AUTH_SECRET || !env.EMAIL_FROM || !env.SMTP_HOST || !env.SMTP_PORT || !env.APP_ORIGIN) return false;
  if (!env.EMAIL_FROM.includes('@')) return false;
  if (parseAllowlist(env.ADMIN_EMAILS).size === 0) return false;
  if (env.SMTP_USER && !env.SMTP_PASSWORD) return false;
  const port = Number(env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return false;
  return originAllowed(env.APP_ORIGIN, env);
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const forwarded = request.headers.get('x-forwarded-host');
  const host = request.headers.get('host') ?? forwarded;
  let urlHost = '';
  try {
    urlHost = new URL(request.url).host;
  } catch {
    return false;
  }
  try {
    const originHost = new URL(origin).host;
    return originHost === host || originHost === urlHost;
  } catch {
    return false;
  }
}
