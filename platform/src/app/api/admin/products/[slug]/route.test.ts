import { afterEach, describe, expect, it } from 'vitest';
import { GET } from '@/app/api/admin/products/route';
import { PATCH } from '@/app/api/admin/products/[slug]/route';
import { ADMIN_COOKIE, signSession } from '@/server/auth/session';
import { getDb } from '@/server/db';

const secret = 'product-route-test-secret';
const previous = {
  AUTH_SECRET: process.env.AUTH_SECRET,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
};
const databaseReady = Boolean(process.env.DATABASE_URL);

afterEach(() => {
  process.env.AUTH_SECRET = previous.AUTH_SECRET;
  process.env.ADMIN_EMAILS = previous.ADMIN_EMAILS;
});

function patch(slug: string, cookie: string | null, body: unknown) {
  return PATCH(
    new Request(`http://127.0.0.1:3000/api/admin/products/${slug}`, {
      method: 'PATCH',
      headers: {
        origin: 'http://127.0.0.1:3000',
        'content-type': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ slug }) },
  );
}

describe('admin product routes', () => {
  it('rejects an unauthenticated list and an unauthenticated update', async () => {
    process.env.AUTH_SECRET = secret;
    process.env.ADMIN_EMAILS = 'owner@example.com';
    const list = await GET(new Request('http://127.0.0.1:3000/api/admin/products'));
    expect(list.status).toBe(401);
    const update = await patch('turquoise-sage-dreamcatcher', null, { price: '10' });
    expect(update.status).toBe(401);
  });

  it.skipIf(!databaseReady)('does not write when the session is outside the allowlist', async () => {
    process.env.AUTH_SECRET = secret;
    process.env.ADMIN_EMAILS = 'owner@example.com';
    const db = getDb();
    const before = await db.handmadeProduct.findUniqueOrThrow({ where: { slug: 'turquoise-sage-dreamcatcher' } });
    const token = await signSession('intruder@example.com', secret);
    const response = await patch('turquoise-sage-dreamcatcher', `${ADMIN_COOKIE}=${token}`, {
      price: '99',
      inventoryMode: 'tracked',
      stock: '4',
    });
    expect(response.status).toBe(403);
    const after = await db.handmadeProduct.findUniqueOrThrow({ where: { slug: 'turquoise-sage-dreamcatcher' } });
    expect(after.priceMinorUnits).toBe(before.priceMinorUnits);
    expect(after.stockQuantity).toBe(before.stockQuantity);
    expect(after.inventoryMode).toBe(before.inventoryMode);
  });

  it.skipIf(!databaseReady)('rejects an invalid price and saves a valid price and zero stock', async () => {
    process.env.AUTH_SECRET = secret;
    process.env.ADMIN_EMAILS = 'owner@example.com';
    const db = getDb();
    const slug = 'turquoise-sage-dreamcatcher';
    const before = await db.handmadeProduct.findUniqueOrThrow({ where: { slug } });
    const token = await signSession('owner@example.com', secret);
    const cookie = `${ADMIN_COOKIE}=${token}`;
    try {
      const invalid = await patch(slug, cookie, { price: '-1' });
      expect(invalid.status).toBe(400);
      expect(await invalid.json()).toEqual({ error: 'invalid_price' });

      const hugeStock = await patch(slug, cookie, { inventoryMode: 'tracked', stock: '2147483648' });
      expect(hugeStock.status).toBe(400);
      expect(await hugeStock.json()).toEqual({ error: 'invalid_stock' });
      const unchanged = await db.handmadeProduct.findUniqueOrThrow({ where: { slug } });
      expect(unchanged.stockQuantity).toBe(before.stockQuantity);
      expect(unchanged.priceMinorUnits).toBe(before.priceMinorUnits);

      const saved = await patch(slug, cookie, { price: '12.50', inventoryMode: 'tracked', stock: '0' });
      expect(saved.status).toBe(200);
      expect(await saved.json()).toEqual({
        slug,
        priceMinorUnits: 1250,
        stockQuantity: 0,
        inventoryMode: 'tracked',
      });

      const name = await db.offeringTranslation.findFirstOrThrow({
        where: { offeringId: before.offeringId, locale: 'en' },
      });
      const partial = await patch(slug, cookie, { price: '' });
      expect(partial.status).toBe(200);
      const cleared = await db.handmadeProduct.findUniqueOrThrow({ where: { slug } });
      expect(cleared.priceMinorUnits).toBeNull();
      expect(cleared.stockQuantity).toBe(0);
      const nameAfter = await db.offeringTranslation.findFirstOrThrow({
        where: { offeringId: before.offeringId, locale: 'en' },
      });
      expect(nameAfter.name).toBe(name.name);
    } finally {
      await db.handmadeProduct.update({
        where: { slug },
        data: {
          priceMinorUnits: before.priceMinorUnits,
          stockQuantity: before.stockQuantity,
          inventoryMode: before.inventoryMode,
        },
      });
    }
  });
});
