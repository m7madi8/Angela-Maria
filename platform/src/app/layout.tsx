import type { ReactNode } from 'react';
import { Fraunces, Hanken_Grotesk, Noto_Naskh_Arabic } from 'next/font/google';
import { headers } from 'next/headers';
import { direction, isLocale, type Locale } from '@/i18n/locales';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
});

const latin = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-latin',
});

const arabic = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500'],
  variable: '--font-arabic',
});

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Foundation — Angela-Maria',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const requested = headerList.get('x-locale');
  const locale: Locale = requested && isLocale(requested) ? requested : 'en';

  return (
    <html lang={locale} dir={direction(locale)} className={`${display.variable} ${latin.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
