import { isLocale, type Locale } from '@/i18n/locales';

export function swapLocale(pathname: string, target: Locale): string {
  const parts = pathname.split('/');
  if (parts[1] && isLocale(parts[1])) {
    parts[1] = target;
    const next = parts.join('/');
    return next || `/${target}`;
  }
  return `/${target}`;
}
