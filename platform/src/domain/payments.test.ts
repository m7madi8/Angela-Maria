import { describe, expect, it } from 'vitest';
import { paymentBoundary } from '@/domain/payments';
import { assertPaymentNotUsed } from '@/server/payments';

describe('payment boundary', () => {
  it('stays disabled and refuses to run a payment', () => {
    expect(paymentBoundary).toEqual({
      configured: false,
      collectsCardData: false,
      marksOrdersPaid: false,
    });
    expect(() => assertPaymentNotUsed()).toThrow(/not configured/i);
  });
});
