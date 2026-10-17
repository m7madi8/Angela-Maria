import type { PrismaClient } from '@prisma/client';
import type { ShopCatalog, SourceProduct } from '@/catalog/load-shop-catalog';

export function offeringIdFor(slug: string): string {
  return `offering:${slug}`;
}

function statusFor(product: SourceProduct): 'draft' | 'published' {
  return product.published ? 'published' : 'draft';
}

export async function seedHandmadeCatalog(db: PrismaClient, catalog: ShopCatalog): Promise<void> {
  await db.$transaction(async (tx) => {
    for (const product of catalog.products) {
      const offeringId = offeringIdFor(product.slug);
      await tx.offering.upsert({
        where: { id: offeringId },
        create: {
          id: offeringId,
          type: 'handmade_product',
          status: statusFor(product),
        },
        update: {
          type: 'handmade_product',
          status: statusFor(product),
        },
      });

      await tx.offeringTranslation.upsert({
        where: { offeringId_locale: { offeringId, locale: 'en' } },
        create: {
          id: `${offeringId}:en`,
          offeringId,
          locale: 'en',
          name: product.name,
          description: product.shortDescription,
        },
        update: {
          name: product.name,
          description: product.shortDescription,
        },
      });

      await tx.handmadeProduct.upsert({
        where: { slug: product.slug },
        create: {
          slug: product.slug,
          offeringId,
          categoryKey: product.categoryKey,
          categoryLabel: product.categoryLabel,
          priceMinorUnits: product.priceMinorUnits,
          currency: 'ILS',
          stockQuantity: product.stockQuantity,
          inventoryMode: 'unknown',
          sourceAvailable: product.sourceAvailable,
          featured: product.featured,
          layout: product.layout,
          imageFocus: product.imageFocus,
          images: product.images,
        },
        update: {
          offeringId,
          categoryKey: product.categoryKey,
          categoryLabel: product.categoryLabel,
          currency: 'ILS',
          sourceAvailable: product.sourceAvailable,
          featured: product.featured,
          layout: product.layout,
          imageFocus: product.imageFocus,
          images: product.images,
        },
      });

      await tx.productTranslation.upsert({
        where: { productSlug_locale: { productSlug: product.slug, locale: 'en' } },
        create: {
          id: `${product.slug}:en`,
          productSlug: product.slug,
          locale: 'en',
          points: product.points,
          materials: product.materials,
          dimensions: product.dimensions,
          care: product.care,
        },
        update: {
          points: product.points,
          materials: product.materials,
          dimensions: product.dimensions,
          care: product.care,
        },
      });
    }
  });
}
