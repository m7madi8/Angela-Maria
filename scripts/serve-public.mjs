/**
 * Local dev server for the public static site (matches vercel.json rewrites).
 * Usage: node scripts/serve-public.mjs
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 3000);

const rewrites = [
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
];

const rewriteMap = new Map(rewrites.map((r) => [r.source, r.destination]));

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
};

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let pathname = normalizePathname(decodeURIComponent(url.pathname));
  if (rewriteMap.has(pathname)) pathname = rewriteMap.get(pathname);

  const filePath = path.normalize(path.join(root, pathname));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Public site: http://localhost:${port}`);
  console.log(`Arabic home: http://localhost:${port}/ar  or  http://localhost:${port}/?lang=ar`);
});
