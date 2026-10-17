import { accessFromRequest } from '@/server/auth/access';
import { catalogImageFile, listAdminProducts, localizedName } from '@/server/products/queries';
import { getDb } from '@/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const access = await accessFromRequest(request, process.env);
  if (!access.ok) return Response.json({ error: access.reason }, { status: access.status });

  const locale = new URL(request.url).searchParams.get('locale') === 'ar' ? 'ar' : 'en';
  try {
    const rows = await listAdminProducts(getDb());
    return Response.json({
      products: rows.map((row) => {
        const name = localizedName(row.offering.translations, locale, row.slug);
        return {
          slug: row.slug,
          name: name.name,
          missingTranslation: name.missingTranslation,
          categoryLabel: row.categoryLabel,
          image: catalogImageFile(row.images),
          priceMinorUnits: row.priceMinorUnits,
          stockQuantity: row.stockQuantity,
          inventoryMode: row.inventoryMode,
          sourceAvailable: row.sourceAvailable,
          currency: 'ILS',
        };
      }),
    });
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
