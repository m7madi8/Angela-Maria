import { FoundationFrame } from '@/components/foundation-frame';
import { LocalSignIn } from '@/components/local-sign-in';
import { SignOutButton } from '@/components/sign-out-button';
import { isLocale, type Locale } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { accessFromRequest, parseAllowlist } from '@/server/auth/access';
import { isLocalHostSignIn, isSignInConfigured } from '@/server/auth/config';
import { catalogImageFile, listAdminProducts, localizedName } from '@/server/products/queries';
import { getDb } from '@/server/db';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function money(minor: number | null, locale: Locale, unset: string): string {
  if (minor === null) return unset;
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-IL' : 'en-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(minor / 100);
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const copy = messages[value];
  const headerList = await headers();
  const host = headerList.get('host') ?? '';
  const request = new Request('http://localhost', { headers: { host, cookie: headerList.get('cookie') ?? '' } });
  const access = await accessFromRequest(request, process.env);
  const localEmail = [...parseAllowlist(process.env.ADMIN_EMAILS)][0] ?? '';

  if (!access.ok) {
    if (isSignInConfigured(process.env)) redirect(`/${value}/admin/sign-in`);
    return (
      <FoundationFrame locale={value}>
        <section className="panel">
          <h1>{copy.closedTitle}</h1>
          <p>{copy.closedBody}</p>
          {isLocalHostSignIn(request, process.env) && localEmail ? <LocalSignIn locale={value} email={localEmail} /> : null}
        </section>
      </FoundationFrame>
    );
  }

  let rows: Awaited<ReturnType<typeof listAdminProducts>> | null = null;
  try {
    rows = await listAdminProducts(getDb());
  } catch {
    rows = null;
  }

  return (
    <FoundationFrame locale={value}>
      <section className="panel">
        <div className="row">
          <h1>{copy.productsTitle}</h1>
          <SignOutButton label={copy.signOut} locale={value} />
        </div>
        <p>
          {copy.signedIn} {access.email}
        </p>
        <p>{copy.readyBody}</p>
        {rows === null ? <p role="alert">{copy.databaseError}</p> : null}
        {rows && rows.length === 0 ? <p>{copy.emptyProducts}</p> : null}
        {rows && rows.length > 0 ? (
          <ul className="products">
            {rows.map((row) => {
              const named = localizedName(row.offering.translations, value, row.slug);
              const image = catalogImageFile(row.images);
              const fulfillment =
                row.inventoryMode === 'made_to_order'
                  ? copy.modeMadeToOrder
                  : row.inventoryMode === 'tracked'
                    ? copy.modeTracked
                    : copy.modeUnknown;
              return (
                <li key={row.slug} className="product">
                  {image ? (
                    // Catalog photos are local product images, not remote content.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/catalog-images/${image}`} alt={named.name} width={72} height={96} />
                  ) : null}
                  <div>
                    <h2>{named.name}</h2>
                    {named.missingTranslation ? <p className="hint">{copy.missingArabic}</p> : null}
                    <p>
                      {copy.category}: {row.categoryLabel}
                    </p>
                    <p>
                      {copy.price}: {money(row.priceMinorUnits, value, copy.notSet)}
                    </p>
                    <p>
                      {copy.stock}: {row.stockQuantity === null ? copy.notSet : row.stockQuantity}
                    </p>
                    <p>
                      {copy.fulfillment}: {fulfillment}
                    </p>
                    <p>{row.sourceAvailable ? copy.sourceListed : copy.sourceUnlisted}</p>
                    <a href={`/${value}/admin/products/${row.slug}`}>{copy.edit}</a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>
    </FoundationFrame>
  );
}
