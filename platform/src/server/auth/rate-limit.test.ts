import { describe, expect, it } from 'vitest';
import { createRateLimiter } from '@/server/auth/rate-limit';

describe('rate limiter', () => {
  it('blocks the request after the limit and opens again when the window ends', () => {
    const limiter = createRateLimiter(2, 1_000);
    expect(limiter.check('a', 0).ok).toBe(true);
    expect(limiter.check('a', 10).ok).toBe(true);
    expect(limiter.check('a', 20).ok).toBe(false);
    expect(limiter.check('b', 20).ok).toBe(true);
    expect(limiter.check('a', 1_000).ok).toBe(true);
  });
});
