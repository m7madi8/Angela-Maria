/**
 * Phase 1 payment boundary.
 * The provider integration is postponed. This object is safe to import from UI code.
 * It must stay disabled: no checkout, no card capture, and no paid state.
 */
export const paymentBoundary = {
  configured: false,
  collectsCardData: false,
  marksOrdersPaid: false,
} as const;
