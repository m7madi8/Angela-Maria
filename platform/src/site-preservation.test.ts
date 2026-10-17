import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { repoRoot } from '@/catalog/catalog-path';

describe('public site preservation', () => {
  it('keeps the Vercel rewrites and the existing pages', () => {
    const root = repoRoot();
    const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')) as {
      rewrites: Array<{ source: string; destination: string }>;
    };
    expect(vercel.rewrites).toEqual([
      { source: '/', destination: '/main.html' },
      { source: '/shop', destination: '/shop.html' },
      { source: '/product', destination: '/product.html' },
    ]);
    for (const file of ['main.html', 'shop.html', 'product.html', 'shop-data.js', 'shop.js', 'workshops.html']) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
    expect(fs.existsSync(path.join(root, 'package.json'))).toBe(false);
  });
});
