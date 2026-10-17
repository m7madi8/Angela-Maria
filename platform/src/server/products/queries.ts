import 'server-only';
import type { PrismaClient } from '@prisma/client';

export function catalogImageFile(images: unknown): string | null {
  if (!Array.isArray(images) || typeof images[0] !== 'string') return null;
  const match = /^images\/mini-store\/([A-Za-z0-9._-]+)$/.exec(images[0]);
  return match?.[1] ?? null;
}

export async function listAdminProducts(db: PrismaClient) {
  return db.handmadeProduct.findMany({
    orderBy: { slug: 'asc' },
    include: {
      offering: { include: { translations: true } },
    },
  });
}

export function localizedName(
  translations: Array<{ locale: string; name: string }>,
  locale: 'en' | 'ar',
  fallback: string,
): { name: string; missingTranslation: boolean } {
  const requested = translations.find((item) => item.locale === locale);
  if (requested) return { name: requested.name, missingTranslation: false };
  const english = translations.find((item) => item.locale === 'en');
  if (english) return { name: english.name, missingTranslation: locale !== 'en' };
  return { name: fallback, missingTranslation: true };
}
