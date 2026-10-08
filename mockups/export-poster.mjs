import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = path.join(dir, 's26-ultra-poster.html');
const out = path.join(dir, 'angela-s26-ultra-poster-2400x3600.png');
const outHi = path.join(dir, 'angela-s26-ultra-poster-4800x7200.png');

const browser = await chromium.launch({ channel: 'chrome' });
for (const [scale, file] of [[1, out], [2, outHi]]) {
  const page = await browser.newPage({
    viewport: { width: 2400, height: 3600 },
    deviceScaleFactor: scale,
  });
  await page.goto(`file:///${html.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: file, type: 'png', fullPage: false });
  await page.close();
  console.log('Wrote', file, `@ ${scale}x`);
}
await browser.close();
