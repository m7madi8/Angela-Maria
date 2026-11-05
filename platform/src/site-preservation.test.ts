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
      { source: '/ar', destination: '/main.html' },
      { source: '/shop', destination: '/shop.html' },
      { source: '/ar/shop', destination: '/shop.html' },
      { source: '/product', destination: '/product.html' },
      { source: '/ar/product', destination: '/product.html' },
      { source: '/ar/workshops.html', destination: '/workshops.html' },
      { source: '/ar/workshop-yoga.html', destination: '/workshop-yoga.html' },
      { source: '/ar/workshop-cacao.html', destination: '/workshop-cacao.html' },
      { source: '/ar/workshop-womens-circles.html', destination: '/workshop-womens-circles.html' },
      { source: '/about', destination: '/about.html' },
      { source: '/ar/about', destination: '/about.html' },
      { source: '/yoga', destination: '/yoga.html' },
      { source: '/ar/yoga', destination: '/yoga.html' },
      { source: '/ar/about.html', destination: '/about.html' },
      { source: '/ar/yoga.html', destination: '/yoga.html' },
    ]);
    for (const file of [
      'main.html',
      'about.html',
      'yoga.html',
      'content-angelina.js',
      'shop.html',
      'product.html',
      'shop-data.js',
      'shop.js',
      'workshops.html',
      'site-i18n-locale.js',
      'site-i18n-strings.js',
      'site-i18n-bindings.js',
      'site-i18n.js',
      'site-i18n-rtl.css',
    ]) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
    expect(fs.existsSync(path.join(root, 'package.json'))).toBe(false);
  });
});
