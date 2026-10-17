type Bucket = { count: number; resetAt: number };

export type RateLimiter = {
  check: (key: string, now?: number) => { ok: true; remaining: number } | { ok: false; retryAt: number };
  reset: () => void;
};

export function createRateLimiter(limit: number, windowMs: number): RateLimiter {
  const buckets = new Map<string, Bucket>();

  return {
    check(key, now = Date.now()) {
      const current = buckets.get(key);
      if (!current || current.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { ok: true, remaining: limit - 1 };
      }
      if (current.count >= limit) return { ok: false, retryAt: current.resetAt };
      current.count += 1;
      return { ok: true, remaining: limit - current.count };
    },
    reset() {
      buckets.clear();
    },
  };
}

export const ADMIN_ATTEMPT_LIMIT = 10;
export const ADMIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

export const adminAttemptLimiter = createRateLimiter(ADMIN_ATTEMPT_LIMIT, ADMIN_ATTEMPT_WINDOW_MS);

/**
 * One budget for the whole process. A client can choose X-Forwarded-For, so that
 * header must not open a new budget. A second application process has its own budget.
 */
export function clientKey(): string {
  return 'admin-sign-in';
}
