import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { handleRequest } from '@/middleware';

describe('foundation routing', () => {
  it('sends the application root to English', () => {
    const response = handleRequest(new NextRequest('http://127.0.0.1:3000/'));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location') ?? '').pathname).toBe('/en');
  });

  it('marks an Arabic request with its locale', () => {
    const response = handleRequest(new NextRequest('http://127.0.0.1:3000/ar/admin'));
    expect(response.headers.get('x-middleware-request-x-locale')).toBe('ar');
  });
});
