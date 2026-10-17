export const locales = ['en', 'ar'] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'ar';
}

export function direction(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function languageTag(locale: Locale): 'en' | 'ar' {
  return locale;
}
