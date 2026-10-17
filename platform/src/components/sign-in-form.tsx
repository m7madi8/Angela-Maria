'use client';

import { useState, type FormEvent } from 'react';
import { messages } from '@/i18n/messages';
import type { Locale } from '@/i18n/locales';

export function SignInForm({ locale, failedLink }: { locale: Locale; failedLink: boolean }) {
  const copy = messages[locale];
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>(failedLink ? 'idle' : 'idle');
  const [notice, setNotice] = useState(failedLink ? copy.linkError : '');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState('sending');
    setNotice('');
    const response = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (response.status === 429) {
      setState('failed');
      setNotice(copy.sendFailed);
      return;
    }
    if (response.ok) {
      setState('sent');
      setNotice(copy.linkSent);
      return;
    }
    setState('failed');
    setNotice(copy.sendFailed);
  }

  return (
    <form className="editor" onSubmit={onSubmit}>
      <label htmlFor="admin-email">{copy.emailLabel}</label>
      <input
        id="admin-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? copy.saving : copy.sendLink}
      </button>
      {notice ? (
        <p role="status" className="notice">
          {notice}
        </p>
      ) : null}
    </form>
  );
}
