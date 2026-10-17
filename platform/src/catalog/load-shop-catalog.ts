import fs from 'node:fs';
import vm from 'node:vm';
import { z } from 'zod';

const categorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  intro: z.string().optional(),
});

const imageSchema = z
  .string()
  .regex(/^images\/[A-Za-z0-9_./-]+$/)
  .refine((value) => !value.includes('..'), 'Image paths cannot climb directories.');

const productSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  category: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string(),
  points: z.array(z.string()),
  materials: z.string().optional(),
  dimensions: z.string().optional(),
  care: z.string().optional(),
  price: z.null(),
  available: z.boolean(),
  featured: z.boolean(),
  published: z.boolean(),
  layout: z.string().min(1),
  images: z.array(imageSchema).min(1),
  imageFocus: z.string().optional(),
});

const shopSchema = z.object({
  categories: z.array(categorySchema).min(1),
  products: z.array(productSchema).min(1),
});

export type SourceProduct = {
  slug: string;
  categoryKey: string;
  categoryLabel: string;
  name: string;
  shortDescription: string;
  points: string[];
  materials: string | null;
  dimensions: string | null;
  care: string | null;
  priceMinorUnits: null;
  stockQuantity: null;
  sourceAvailable: boolean;
  featured: boolean;
  published: boolean;
  layout: string;
  images: string[];
  imageFocus: string | null;
};

export type ShopCatalog = {
  products: SourceProduct[];
};

export function loadShopCatalog(filePath: string): ShopCatalog {
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox: { window: Record<string, unknown> } = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: filePath });
  const parsed = shopSchema.parse(sandbox.window.ANGILA_SHOP);
  const labels = new Map(parsed.categories.map((category) => [category.id, category.label]));
  const slugs = new Set<string>();

  const products = parsed.products.map((product) => {
    if (slugs.has(product.slug)) {
      throw new Error(`Duplicate product slug: ${product.slug}`);
    }
    slugs.add(product.slug);
    const categoryLabel = labels.get(product.category);
    if (!categoryLabel) {
      throw new Error(`Product ${product.slug} uses an unknown category.`);
    }
    return {
      slug: product.slug,
      categoryKey: product.category,
      categoryLabel,
      name: product.name,
      shortDescription: product.shortDescription,
      points: product.points,
      materials: product.materials ?? null,
      dimensions: product.dimensions ?? null,
      care: product.care ?? null,
      priceMinorUnits: null,
      stockQuantity: null,
      sourceAvailable: product.available,
      featured: product.featured,
      published: product.published,
      layout: product.layout,
      images: product.images,
      imageFocus: product.imageFocus ?? null,
    } satisfies SourceProduct;
  });

  return { products };
}
