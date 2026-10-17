'use client';

export function SignOutButton({ label, locale }: { label: string; locale: 'en' | 'ar' }) {
  return (
    <button
      type="button"
      className="text-button"
      onClick={() => {
        void fetch('/api/admin/session', { method: 'DELETE' }).finally(() => {
          window.location.assign(`/${locale}/admin/sign-in`);
        });
      }}
    >
      {label}
    </button>
  );
}
