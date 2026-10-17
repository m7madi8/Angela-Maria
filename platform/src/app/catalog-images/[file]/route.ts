import fs from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }): Promise<Response> {
  const { file } = await context.params;
  if (!/^[A-Za-z0-9._-]+$/.test(file)) return new Response(null, { status: 404 });
  const directory = path.resolve(process.cwd(), '..', 'images', 'mini-store');
  const full = path.resolve(directory, file);
  if (!full.startsWith(directory + path.sep)) return new Response(null, { status: 404 });
  try {
    const bytes = await fs.readFile(full);
    return new Response(bytes, {
      headers: {
        'content-type': 'image/jpeg',
        'cache-control': 'private, max-age=3600',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
