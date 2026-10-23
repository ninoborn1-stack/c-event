import { val } from '@c-event/core';
import { adminUi, brand } from '@c-event/content';
import { AdminApp } from '@/components/admin/AdminApp';

export const metadata = { title: adminUi.title, robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <section className="admin-page">
      <header className="page-head page-head--small">
        <span className="eyebrow">{brand.name}</span>
        <h1 className="page-head__title">{adminUi.title}</h1>
      </header>
      <AdminApp slogans={val(brand.slogans).map((s) => s.lines.join(' '))} />
    </section>
  );
}
