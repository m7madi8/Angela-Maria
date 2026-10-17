import { FoundationFrame } from '@/components/foundation-frame';
import { ProductEditor } from '@/components/product-editor';
import { isLocale, type Locale } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { accessFromRequest } from '@/server/auth/access';
import { isLocalHostSignIn, isSignInConfigured } from '@/server/auth/config';
import { catalogImageFile, localizedName } from '@/server/products/queries';
import { minorToIlsInput } from '@/server/products/update';
import { getDb } from '@/server/db';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function loadProduct(slug: string) {
  return getDb().handmadeProduct.findUnique({
    where: { slug },
    include: { offering: { include: { translations: true } } },
  });
}

export default async function ProductEditPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: value, slug } = await params;
  if (!isLocale(value)) notFound();
  const copy = messages[value];
  const headerList = await headers();
  const host = headerList.get('host') ?? '';
  const request = new Request('http://localhost', { headers: { host, cookie: headerList.get('cookie') ?? '' } });
  const access = await accessFromRequest(request, process.env);
  if (!access.ok) {
    if (isSignInConfigured(process.env) || isLocalHostSignIn(request, process.env)) redirect(`/${value}/admin`);
    return (
      <FoundationFrame locale={value}>
        <section className="panel">
          <h1>{copy.closedTitle}</h1>
          <p>{copy.closedBody}</p>
        </section>
      </FoundationFrame>
    );
  }

  const locale: Locale = value;
  let row: Awaited<ReturnType<typeof loadProduct>> = null;
  try {
    row = await loadProduct(slug);
  } catch {
    return (
      <FoundationFrame locale={value}>
        <section className="panel">
          <p role="alert">{copy.databaseError}</p>
        </section>
      </FoundationFrame>
    );
  }
  if (!row) notFound();
  const named = localizedName(row.offering.translations, locale, row.slug);
  const image = catalogImageFile(row.images);

  return (
    <FoundationFrame locale={value}>
      <section className="panel">
        <p>
          <a href={`/${value}/admin`}>{copy.back}</a>
        </p>
        <div className="product">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/catalog-images/${image}`} alt={named.name} width={72} height={96} />
          ) : null}
          <div>
            <h1>{named.name}</h1>
            {named.missingTranslation ? <p className="hint">{copy.missingArabic}</p> : null}
            <p>
              {copy.category}: {row.categoryLabel}
            </p>
            <p>{row.sourceAvailable ? copy.sourceListed : copy.sourceUnlisted}</p>
          </div>
        </div>
        <ProductEditor
          locale={locale}
          slug={row.slug}
          price={minorToIlsInput(row.priceMinorUnits)}
          stock={row.stockQuantity === null ? '' : String(row.stockQuantity)}
          inventoryMode={row.inventoryMode}
        />
      </section>
    </FoundationFrame>
  );
}
