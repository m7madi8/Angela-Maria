import { describe, expect, it } from 'vitest';
import { minorToIlsInput, parseIlsToMinor, planProductUpdate } from '@/server/products/update';

const tracked = { inventoryMode: 'tracked' as const, priceMinorUnits: 100, stockQuantity: 2 };

describe('product commercial updates', () => {
  it('stores shekels as agorot and keeps an empty price unknown', () => {
    expect(parseIlsToMinor('12.50')).toBe(1250);
    expect(parseIlsToMinor('12.5')).toBe(1250);
    expect(parseIlsToMinor('10')).toBe(1000);
    expect(parseIlsToMinor('0')).toBe(0);
    expect(parseIlsToMinor('')).toBeNull();
    expect(parseIlsToMinor('  ')).toBeNull();
    expect(parseIlsToMinor('-1')).toBe('invalid');
    expect(parseIlsToMinor('1.555')).toBe('invalid');
    expect(parseIlsToMinor('1000000.01')).toBe('invalid');
    expect(parseIlsToMinor('-0')).toBe('invalid');
    expect(minorToIlsInput(1250)).toBe('12.50');
    expect(minorToIlsInput(null)).toBe('');
  });

  it('treats an omitted field as unchanged and never turns unknown stock into zero', () => {
    expect(planProductUpdate(tracked, { price: '' }).ok && planProductUpdate(tracked, { price: '' })).toMatchObject({
      ok: true,
      data: { priceMinorUnits: null, stockQuantity: 2, inventoryMode: 'tracked' },
    });
    expect(planProductUpdate({ inventoryMode: 'unknown', priceMinorUnits: null, stockQuantity: null }, {})).toMatchObject({
      ok: true,
      data: { priceMinorUnits: null, stockQuantity: null, inventoryMode: 'unknown' },
    });
  });

  it('accepts an explicit zero stock only for counted inventory', () => {
    expect(planProductUpdate(tracked, { stock: '0' })).toMatchObject({
      ok: true,
      data: { stockQuantity: 0, priceMinorUnits: 100 },
    });
    expect(planProductUpdate({ inventoryMode: 'unknown', priceMinorUnits: null, stockQuantity: null }, { stock: '0' })).toEqual({
      ok: false,
      error: 'stock_not_tracked',
    });
    expect(planProductUpdate(tracked, { inventoryMode: 'made_to_order' })).toMatchObject({
      ok: true,
      data: { inventoryMode: 'made_to_order', stockQuantity: null, priceMinorUnits: 100 },
    });
    expect(planProductUpdate(tracked, { stock: '-3' })).toEqual({ ok: false, error: 'invalid_stock' });
    expect(planProductUpdate(tracked, { stock: '1.5' })).toEqual({ ok: false, error: 'invalid_stock' });
    expect(planProductUpdate(tracked, { stock: '2147483648' })).toEqual({ ok: false, error: 'invalid_stock' });
    expect(planProductUpdate(tracked, { stock: '2147483647' })).toMatchObject({
      ok: true,
      data: { stockQuantity: 2147483647 },
    });
    expect(planProductUpdate({ inventoryMode: 'made_to_order', priceMinorUnits: null, stockQuantity: null }, { stock: '3' })).toEqual({
      ok: false,
      error: 'stock_not_tracked',
    });
    expect(planProductUpdate(tracked, { price: 'nope' })).toEqual({ ok: false, error: 'invalid_price' });
    expect(planProductUpdate(tracked, { inventoryMode: 'warehouse' })).toEqual({ ok: false, error: 'invalid_mode' });
  });
});
