import Link from 'next/link';
import { isPlaceholder, val, type CatalogItem, type CatalogPackage } from '@c-event/core';
import { catalog, productHref } from '@c-event/content';
import { AddToCart } from '@/components/cart/AddToCart';
import { Media } from '@/components/Media';
import { PhText } from '@/components/Ph';
import { DepositTag, PriceTag } from './PriceTag';

/** Produktkarte für Artikel UND Pakete – gleiche Form im Shop, auf Leistungsseiten und der Startseite. */
export function ProductCard({ item }: { item: CatalogItem }) {
  const cat = catalog.categories.find((c) => c.id === item.category);
  const dep = item.depositCents === undefined ? 0 : val(item.depositCents);
  return (
    <article className="product">
      <Link href={productHref(item.id)} className="product__img" data-label={item.name}>
        <Media id={item.media} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 45vw, 100vw" />
        <span className="product__cat">{cat?.label}</span>
      </Link>
      <div className="product__body">
        <h3>
          <Link href={productHref(item.id)} data-label={item.name}>
            {item.name}
          </Link>
        </h3>
        <PhText v={item.short} className="product__short" />
        <div className="product__meta">
          <PriceTag price={val(item.price)} />
          <DepositTag cents={dep} note={isPlaceholder(item.depositCents) ? item.depositCents.note : undefined} />
          {item.minQty ? <small>min. {item.minQty}</small> : null}
        </div>
        <AddToCart kind="item" id={item.id} qty={item.minQty ?? 1} />
      </div>
    </article>
  );
}

export function PackageCard({ pkg, index }: { pkg: CatalogPackage; index: number }) {
  return (
    <article className="product product--pkg">
      <Link href={productHref(pkg.id)} className="product__img" data-label={pkg.name}>
        <Media id={pkg.media} sizes="(min-width: 1000px) 33vw, 100vw" />
        <span className="product__size">{['S', 'M', 'L'][index] ?? '+'}</span>
      </Link>
      <div className="product__body">
        <span className="eyebrow">{pkg.guests}</span>
        <h3>
          <Link href={productHref(pkg.id)} data-label={pkg.name}>
            {pkg.name}
          </Link>
        </h3>
        <p className="product__short">{pkg.tagline}</p>
        <ul className="product__incl">
          {pkg.items.slice(0, 4).map((pi) => {
            const it = catalog.items.find((i) => i.id === pi.itemId);
            return it ? (
              <li key={pi.itemId}>
                <b>{pi.qty}×</b> {it.name}
              </li>
            ) : null;
          })}
          {pkg.items.length > 4 && <li>+ {pkg.items.length - 4} weitere</li>}
        </ul>
        <div className="product__meta">
          <PriceTag price={val(pkg.price)} />
        </div>
        <AddToCart kind="package" id={pkg.id} />
      </div>
    </article>
  );
}
