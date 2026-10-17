import { FoundationFrame } from '@/components/foundation-frame';
import { LocalSignIn } from '@/components/local-sign-in';
import { SignInForm } from '@/components/sign-in-form';
import { isLocale } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { accessFromRequest, parseAllowlist } from '@/server/auth/access';
import { isLocalHostSignIn, isSignInConfigured } from '@/server/auth/config';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const copy = messages[value];
  const headerList = await headers();
  const host = headerList.get('host') ?? '';
  const request = new Request('http://localhost', { headers: { host, cookie: headerList.get('cookie') ?? '' } });
  if (!isSignInConfigured(process.env)) {
    const localEmail = [...parseAllowlist(process.env.ADMIN_EMAILS)][0] ?? '';
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
  const access = await accessFromRequest(request, process.env);
  if (access.ok) redirect(`/${value}/admin`);
  const query = await searchParams;

  return (
    <FoundationFrame locale={value}>
      <section className="panel">
        <h1>{copy.signInTitle}</h1>
        <p>{copy.signInBody}</p>
        <SignInForm locale={value} failedLink={query.error === '1'} />
      </section>
    </FoundationFrame>
  );
}
