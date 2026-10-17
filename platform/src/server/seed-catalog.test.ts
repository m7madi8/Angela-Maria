import { describe, expect, it } from 'vitest';
import { catalogPath } from '@/catalog/catalog-path';
import { loadShopCatalog } from '@/catalog/load-shop-catalog';
import { getDb } from '@/server/db';
import { offeringIdFor, seedHandmadeCatalog } from '@/server/seed-catalog';

const databaseReady = Boolean(process.env.DATABASE_URL);

describe('handmade catalog seed', () => {
  it.skipIf(!databaseReady)('is idempotent and matches the source catalog', async () => {
    const db = getDb();
    const catalog = loadShopCatalog(catalogPath());
    try {
      await db.offeringTranslation.deleteMany({ where: { locale: 'ar' } });
      await seedHandmadeCatalog(db, catalog);
      await db.offeringTranslation.create({
        data: {
          id: `${offeringIdFor(catalog.products[0].slug)}:ar`,
          offeringId: offeringIdFor(catalog.products[0].slug),
          locale: 'ar',
          name: 'ترجمة موجودة',
          description: 'لا تُمس',
        },
      });

      const edited = [...catalog.products].sort((a, b) => a.slug.localeCompare(b.slug))[0].slug;
      await db.handmadeProduct.update({
        where: { slug: edited },
        data: { priceMinorUnits: 1250, stockQuantity: 0, inventoryMode: 'tracked' },
      });

      await seedHandmadeCatalog(db, catalog);

      const products = await db.handmadeProduct.findMany({
        include: { offering: true, translations: true },
        orderBy: { slug: 'asc' },
      });
      const source = [...catalog.products].sort((a, b) => a.slug.localeCompare(b.slug));
      expect(products).toHaveLength(source.length);

      for (const [index, row] of products.entries()) {
        const item = source[index];
        expect(row.slug).toBe(item.slug);
        expect(row.offeringId).toBe(offeringIdFor(item.slug));
        expect(row.offering.type).toBe('handmade_product');
        expect(row.offering.status).toBe(item.published ? 'published' : 'draft');
        if (row.slug === source[0].slug) {
          expect(row.priceMinorUnits).toBe(1250);
          expect(row.stockQuantity).toBe(0);
          expect(row.inventoryMode).toBe('tracked');
        } else {
          expect(row.priceMinorUnits).toBeNull();
          expect(row.stockQuantity).toBeNull();
          expect(row.inventoryMode).toBe('unknown');
        }
        expect(row.currency).toBe('ILS');
        expect(row.sourceAvailable).toBe(item.sourceAvailable);
        expect(row.categoryKey).toBe(item.categoryKey);
        expect(row.categoryLabel).toBe(item.categoryLabel);
        expect(row.images).toEqual(item.images);
        expect(row.featured).toBe(item.featured);
        expect(row.layout).toBe(item.layout);
        expect(row.imageFocus).toBe(item.imageFocus);

        const english = await db.offeringTranslation.findUniqueOrThrow({
          where: { offeringId_locale: { offeringId: row.offeringId, locale: 'en' } },
        });
        expect(english.name).toBe(item.name);
        expect(english.description).toBe(item.shortDescription);

        const details = row.translations.find((translation) => translation.locale === 'en');
        expect(details?.points).toEqual(item.points);
        expect(details?.materials).toBe(item.materials);
        expect(details?.dimensions).toBe(item.dimensions);
        expect(details?.care).toBe(item.care);
        expect(row.translations.some((translation) => translation.locale === 'ar')).toBe(false);
      }

      const preserved = await db.offeringTranslation.findUnique({
        where: {
          offeringId_locale: {
            offeringId: offeringIdFor(catalog.products[0].slug),
            locale: 'ar',
          },
        },
      });
      expect(preserved?.name).toBe('ترجمة موجودة');

      const offeringCount = await db.offering.count({ where: { type: 'handmade_product' } });
      expect(offeringCount).toBe(catalog.products.length);
    } finally {
      const edited = [...catalog.products].sort((a, b) => a.slug.localeCompare(b.slug))[0].slug;
      await db.handmadeProduct
        .update({
          where: { slug: edited },
          data: { priceMinorUnits: null, stockQuantity: null, inventoryMode: 'unknown' },
        })
        .catch(() => undefined);
      await db.offeringTranslation.deleteMany({ where: { locale: 'ar' } });
      await db.$disconnect();
    }
  });
});
