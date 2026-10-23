'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { catalog, shopPage } from '@c-event/content';
import { ProductCard } from './ProductCard';

/** Artikel mit Kategorie-Filter; ?kategorie=… aus der URL wählt vor (Links von den Leistungsseiten). */
export function ShopBrowser() {
  const sp = useSearchParams();
  const initial = sp.get('kategorie');
  const [cat, setCat] = useState<string>(catalog.categories.some((c) => c.id === initial) ? initial! : 'alle');
  const items = cat === 'alle' ? catalog.items : catalog.items.filter((i) => i.category === cat);
  return (
    <div className="shop">
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
