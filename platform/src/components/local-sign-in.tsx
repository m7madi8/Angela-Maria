'use client';

import { useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/locales';
import { messages } from '@/i18n/messages';

export function LocalSignIn({ locale, email }: { locale: Locale; email: string }) {
  const copy = messages[locale];
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice('');
    const response = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      window.location.assign(`/${locale}/admin`);
      return;
    }
    setPending(false);
    setNotice(copy.sendFailed);
  }

  return (
    <form className="editor" onSubmit={onSubmit}>
      <p>{copy.localBody}</p>
      <button type="submit" disabled={pending}>
        {pending ? copy.saving : copy.localContinue}
      </button>
      {notice ? (
        <p role="status" className="notice">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
