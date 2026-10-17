import { accessFromRequest } from '@/server/auth/access';

export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const access = await accessFromRequest(request, process.env);
  if (!access.ok) {
    const status = access.status;
    return Response.json({ error: access.reason }, { status });
  }
  return Response.json({ ok: true, email: access.email });
}
