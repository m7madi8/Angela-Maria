import { accessFromRequest } from '@/server/auth/access';
import { isSameOrigin } from '@/server/auth/config';
import { planProductUpdate } from '@/server/products/update';
import { getDb } from '@/server/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const patchSchema = z
  .object({
    price: z.string().max(20).optional(),
    inventoryMode: z.string().max(40).optional(),
    stock: z.string().max(20).optional(),
  })
  .strict();

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }): Promise<Response> {
  const access = await accessFromRequest(request, process.env);
  if (!access.ok) return Response.json({ error: access.reason }, { status: access.status });
  if (!isSameOrigin(request)) return Response.json({ error: 'cross_origin' }, { status: 403 });

  const { slug } = await context.params;
  if (!/^[a-z0-9-]+$/.test(slug)) return Response.json({ error: 'not_found' }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'invalid_body' }, { status: 400 });

  const db = getDb();
  try {
    const current = await db.handmadeProduct.findUnique({ where: { slug } });
    if (!current) return Response.json({ error: 'not_found' }, { status: 404 });
    const planned = planProductUpdate(current, parsed.data);
    if (!planned.ok) return Response.json({ error: planned.error }, { status: 400 });

    const updated = await db.handmadeProduct.update({
      where: { slug },
      data: planned.data,
    });
    return Response.json({
      slug: updated.slug,
      priceMinorUnits: updated.priceMinorUnits,
      stockQuantity: updated.stockQuantity,
      inventoryMode: updated.inventoryMode,
    });
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
