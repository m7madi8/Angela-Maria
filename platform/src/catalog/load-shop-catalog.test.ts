import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { catalogPath, repoRoot } from '@/catalog/catalog-path';
import { loadShopCatalog } from '@/catalog/load-shop-catalog';

const expectedSlugs = [
  'turquoise-sage-dreamcatcher',
  'teal-tiered-dreamcatcher',
  'sage-tiered-dreamcatcher',
  'earth-feather-dreamcatcher',
  'lavender-amethyst-dreamcatcher',
  'plum-fringe-wall-hanging',
  'forest-multi-hoop-dreamcatcher',
  'teal-beaded-dreamcatcher',
  'plum-beaded-dreamcatcher',
  'tree-of-life-wire-hanging',
  'artisan-stand-collection',
];

describe('shop catalog source', () => {
  const catalog = loadShopCatalog(catalogPath());

  it('imports the 11 handmade products without inventing price or stock', () => {
    expect(catalog.products.map((product) => product.slug)).toEqual(expectedSlugs);
    for (const product of catalog.products) {
      expect(product.priceMinorUnits).toBeNull();
      expect(product.stockQuantity).toBeNull();
      expect(product.sourceAvailable).toBe(true);
      expect(product.images.length).toBeGreaterThan(0);
      for (const image of product.images) {
        expect(fs.existsSync(path.join(repoRoot(), image))).toBe(true);
      }
    }
  });

  it('keeps the English category label from the source', () => {
    const hanging = catalog.products.find((product) => product.slug === 'plum-fringe-wall-hanging');
    expect(hanging?.categoryKey).toBe('macrame');
    expect(hanging?.categoryLabel).toBe('Macramé');
  });

  it('rejects a source price because the unit is not specified', () => {
    const file = path.join(repoRoot(), 'shop-data.js');
    const broken = fs.readFileSync(file, 'utf8').replace('price: null', 'price: 10');
    const temp = path.join(repoRoot(), 'platform', '.tmp-priced-catalog.js');
    fs.writeFileSync(temp, broken);
    try {
      expect(() => loadShopCatalog(temp)).toThrow();
    } finally {
      fs.unlinkSync(temp);
    }
  });
});
