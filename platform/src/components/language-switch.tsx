'use client';

import { usePathname } from 'next/navigation';
import { messages } from '@/i18n/messages';
import { swapLocale } from '@/i18n/path';
import type { Locale } from '@/i18n/locales';

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const copy = messages[locale];
  const items: Array<{ locale: Locale; label: string }> = [
    { locale: 'en', label: copy.english },
    { locale: 'ar', label: copy.arabic },
  ];

  return (
    <nav aria-label={copy.language}>
      <ul className="languages">
        {items.map((item) => (
          <li key={item.locale}>
            <a
              href={swapLocale(pathname, item.locale)}
              hrefLang={item.locale}
              lang={item.locale}
              aria-current={item.locale === locale ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
