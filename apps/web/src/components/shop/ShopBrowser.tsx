'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { catalog, getService, shopPage } from '@c-event/content';
import { rememberOrigin } from '@/lib/origin';
import { ProductCard } from './ProductCard';

/**
 * Artikel mit Kategorie-Filter. ?kategorie=… wählt vor, ?von=… (Leistungs-Slug oder „match“) zeigt,
 * woher man kommt, und wird für die Anfrage gemerkt.
 */
export function ShopBrowser() {
  const sp = useSearchParams();
  const initial = sp.get('kategorie');
  const from = sp.get('von');
  const service = from ? getService(from) : undefined;
  const [cat, setCat] = useState<string>(catalog.categories.some((c) => c.id === initial) ? initial! : 'alle');
  const items = cat === 'alle' ? catalog.items : catalog.items.filter((i) => i.category === cat);
  useEffect(() => rememberOrigin(from), [from]);

  return (
    <div className="shop">
      {(service || from === 'match') && (
        <div className="shop-from">
          <p>
            <span className="mono">{shopPage.from.label}</span>
            <strong>{service ? service.name : shopPage.from.match}</strong>
            <span className="muted">{shopPage.from.preselected}</span>
          </p>
          <div className="shop-from__links">
            {service && (
              <Link href={`/leistungen/${service.slug}`} className="text-link" data-label={service.name}>
                ← {shopPage.from.back}
              </Link>
            )}
            {cat !== 'alle' && (
              <button type="button" className="link-btn" onClick={() => setCat('alle')}>
                {shopPage.from.showAll}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="chips" role="tablist" aria-label="Kategorien">
        {[{ id: 'alle', label: shopPage.all }, ...catalog.categories].map((c) => {
          const n = c.id === 'alle' ? catalog.items.length : catalog.items.filter((i) => i.category === c.id).length;
          return (
            <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={`chip${cat === c.id ? ' is-on' : ''}`} onClick={() => setCat(c.id)}>
              {c.label}
              <sup>{n}</sup>
            </button>
          );
        })}
      </div>
      <div className="products">
        {items.map((i) => (
          <ProductCard key={i.id} item={i} />
        ))}
      </div>
    </div>
  );
}
