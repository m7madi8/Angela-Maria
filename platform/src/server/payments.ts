import 'server-only';
import { paymentBoundary } from '@/domain/payments';

export function assertPaymentNotUsed(): never {
  if (
    paymentBoundary.configured ||
    paymentBoundary.collectsCardData ||
    paymentBoundary.marksOrdersPaid
  ) {
    throw new Error('Payment configuration drifted from the postponed boundary.');
  }
  throw new Error('Payment provider is not configured.');
}
