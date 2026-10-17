export const inventoryModes = ['unknown', 'made_to_order', 'tracked'] as const;
export type InventoryMode = (typeof inventoryModes)[number];

export type ProductCommercialState = {
  inventoryMode: InventoryMode;
  priceMinorUnits: number | null;
  stockQuantity: number | null;
};

export type ProductUpdateError = 'invalid_price' | 'invalid_stock' | 'invalid_mode' | 'stock_not_tracked';

const MAX_MINOR = 100_000_000;
const MAX_STOCK = 2_147_483_647;

export function minorToIlsInput(minor: number | null): string {
  if (minor === null) return '';
  return `${Math.trunc(minor / 100)}.${String(Math.abs(minor % 100)).padStart(2, '0')}`;
}

export function parseIlsToMinor(value: string): number | null | 'invalid' {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return 'invalid';
  const [whole, fraction = ''] = trimmed.split('.');
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(minor) || minor > MAX_MINOR) return 'invalid';
  return minor;
}

export function parseStockQuantity(value: string): number | null | 'invalid' {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d+$/.test(trimmed)) return 'invalid';
  const quantity = Number(trimmed);
  if (!Number.isSafeInteger(quantity) || quantity > MAX_STOCK) return 'invalid';
  return quantity;
}

export function planProductUpdate(
  current: ProductCommercialState,
  patch: { price?: string; inventoryMode?: string; stock?: string },
): { ok: true; data: ProductCommercialState } | { ok: false; error: ProductUpdateError } {
  let inventoryMode = current.inventoryMode;
  let priceMinorUnits = current.priceMinorUnits;
  let stockQuantity = current.stockQuantity;

  if (patch.inventoryMode !== undefined) {
    if (!inventoryModes.includes(patch.inventoryMode as InventoryMode)) {
      return { ok: false, error: 'invalid_mode' };
    }
    inventoryMode = patch.inventoryMode as InventoryMode;
  }

  if (patch.price !== undefined) {
    const price = parseIlsToMinor(patch.price);
    if (price === 'invalid') return { ok: false, error: 'invalid_price' };
    priceMinorUnits = price;
  }

  if (patch.stock !== undefined) {
    const stock = parseStockQuantity(patch.stock);
    if (stock === 'invalid') return { ok: false, error: 'invalid_stock' };
    stockQuantity = stock;
  }

  if (inventoryMode !== 'tracked') {
    if (patch.stock !== undefined && stockQuantity !== null) {
      return { ok: false, error: 'stock_not_tracked' };
    }
    stockQuantity = null;
  }

  return { ok: true, data: { inventoryMode, priceMinorUnits, stockQuantity } };
}
