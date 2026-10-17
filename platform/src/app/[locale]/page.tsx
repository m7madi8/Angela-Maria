import Link from 'next/link';
import { catalogPath } from '@/catalog/catalog-path';
import { loadShopCatalog } from '@/catalog/load-shop-catalog';
import { FoundationFrame } from '@/components/foundation-frame';
import { paymentBoundary } from '@/domain/payments';
import { isLocale } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { notFound } from 'next/navigation';

export default async function FoundationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (paymentBoundary.configured || paymentBoundary.collectsCardData || paymentBoundary.marksOrdersPaid) {
    throw new Error('Refusing to render a payment state that this phase does not implement.');
  }

  const copy = messages[locale];
  const catalog = loadShopCatalog(catalogPath());

  return (
    <FoundationFrame locale={locale}>
      <p className="kicker">{copy.kicker}</p>
      <h1>Angela-Maria</h1>
      <p className="lede">{copy.lede}</p>
      <hr className="rule" />
      <p className="note">{copy.payments}</p>
      <p className="note">{copy.catalog(catalog.products.length)}</p>
      <p className="nav">
        <Link href={`/${locale}/admin`}>{copy.admin}</Link>
      </p>
    </FoundationFrame>
  );
}
