import { describe, expect, it } from 'vitest';
import { getDb } from '@/server/db';

const databaseReady = Boolean(process.env.DATABASE_URL);

describe('handmade product constraints', () => {
  it.skipIf(!databaseReady)('rejects a stock count on an unknown fulfillment mode and a negative price', async () => {
    const db = getDb();
    const slug = 'turquoise-sage-dreamcatcher';
    const before = await db.handmadeProduct.findUniqueOrThrow({ where: { slug } });
    await expect(
      db.handmadeProduct.update({
        where: { slug },
        data: { inventoryMode: 'unknown', stockQuantity: 4 },
      }),
    ).rejects.toThrow();
    await expect(
      db.handmadeProduct.update({
        where: { slug },
        data: { priceMinorUnits: -1 },
      }),
    ).rejects.toThrow();
    const after = await db.handmadeProduct.findUniqueOrThrow({ where: { slug } });
    expect(after.stockQuantity).toBe(before.stockQuantity);
    expect(after.priceMinorUnits).toBe(before.priceMinorUnits);
    expect(after.inventoryMode).toBe(before.inventoryMode);
    expect(after.categoryKey).toBe(before.categoryKey);
    expect(after.sourceAvailable).toBe(before.sourceAvailable);
  });
});