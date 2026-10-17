import { describe, expect, it } from 'vitest';
import { direction } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { swapLocale } from '@/i18n/path';
import { catalogPath } from '@/catalog/catalog-path';
import { loadShopCatalog } from '@/catalog/load-shop-catalog';

describe('locale routing', () => {
  it('switches the locale prefix and keeps the rest of the path', () => {
    expect(swapLocale('/en/admin', 'ar')).toBe('/ar/admin');
    expect(swapLocale('/ar', 'en')).toBe('/en');
    expect(swapLocale('/', 'ar')).toBe('/ar');
  });

  it('sets direction from the locale', () => {
    expect(direction('en')).toBe('ltr');
    expect(direction('ar')).toBe('rtl');
  });

  it('does not translate product names or descriptions', () => {
    const catalog = loadShopCatalog(catalogPath());
    const blob = JSON.stringify(messages);
    for (const product of catalog.products) {
      expect(blob).not.toContain(product.name);
      expect(blob).not.toContain(product.shortDescription);
    }
    expect(messages.en.payments).toMatch(/not enabled/i);
    expect(messages.ar.payments).toMatch(/غير مفعّل/);
  });
});
