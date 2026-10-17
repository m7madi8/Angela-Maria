import type { ReactNode } from 'react';
import { LanguageSwitch } from '@/components/language-switch';
import { messages } from '@/i18n/messages';
import type { Locale } from '@/i18n/locales';

export function FoundationFrame({ locale, children }: { locale: Locale; children: ReactNode }) {
  const copy = messages[locale];
  return (
    <>
      <a className="skip" href="#content">
        {copy.skip}
      </a>
      <main id="content" className="frame">
        <LanguageSwitch locale={locale} />
        {children}
      </main>
    </>
  );
}
