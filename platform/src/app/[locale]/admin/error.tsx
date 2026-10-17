'use client';

import { usePathname } from 'next/navigation';

export default function AdminError() {
  const arabic = usePathname()?.startsWith('/ar');
  return (
    <main className="panel">
      <p role="alert">{arabic ? 'تعذر عرض صفحة الإدارة.' : 'The administration page could not be shown.'}</p>
    </main>
  );
}
