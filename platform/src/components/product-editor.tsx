'use client';

import { useState, type FormEvent } from 'react';
import { messages } from '@/i18n/messages';
import type { Locale } from '@/i18n/locales';
import type { InventoryMode } from '@/server/products/update';

export function ProductEditor({
  locale,
  slug,
  price,
  stock,
  inventoryMode,
}: {
  locale: Locale;
  slug: string;
  price: string;
  stock: string;
  inventoryMode: InventoryMode;
}) {
  const copy = messages[locale];
  const [mode, setMode] = useState<InventoryMode>(inventoryMode);
  const [priceValue, setPriceValue] = useState(price);
  const [stockValue, setStockValue] = useState(stock);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [notice, setNotice] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('saving');
    setNotice('');
    const response = await fetch(`/api/admin/products/${slug}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        price: priceValue,
        inventoryMode: mode,
        stock: mode === 'tracked' ? stockValue : '',
      }),
    });
    if (response.ok) {
      setState('saved');
      setNotice(copy.saved);
      if (mode !== 'tracked') setStockValue('');
      return;
    }
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    setState('error');
    if (payload?.error === 'invalid_price') setNotice(copy.invalidPrice);
    else if (payload?.error === 'invalid_stock' || payload?.error === 'stock_not_tracked') setNotice(copy.invalidStock);
    else setNotice(copy.unavailable);
  }

  return (
    <form className="editor" onSubmit={onSubmit}>
      <label htmlFor="price">{copy.price}</label>
      <input
        id="price"
        name="price"
        inputMode="decimal"
        autoComplete="off"
        value={priceValue}
        onChange={(event) => setPriceValue(event.target.value)}
      />
      <p className="hint">{copy.priceHint}</p>

      <label htmlFor="fulfillment">{copy.fulfillment}</label>
      <select
        id="fulfillment"
        name="inventoryMode"
        value={mode}
        onChange={(event) => setMode(event.target.value as InventoryMode)}
      >
        <option value="unknown">{copy.modeUnknown}</option>
        <option value="made_to_order">{copy.modeMadeToOrder}</option>
        <option value="tracked">{copy.modeTracked}</option>
      </select>

      <label htmlFor="stock">{copy.stock}</label>
      <input
        id="stock"
        name="stock"
        inputMode="numeric"
        autoComplete="off"
        disabled={mode !== 'tracked'}
        value={mode === 'tracked' ? stockValue : ''}
        onChange={(event) => setStockValue(event.target.value)}
      />
      <p className="hint">{copy.stockHint}</p>

      <button type="submit" disabled={state === 'saving'}>
        {state === 'saving' ? copy.saving : copy.save}
      </button>
      {notice ? (
        <p role="status" className="notice">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
