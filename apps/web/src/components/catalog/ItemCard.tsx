import { isPlaceholder, val, type CatalogItem, type CatalogPackage } from '@c-event/core';
import { catalog } from '@c-event/content';
import { AddToRider } from '@/components/rider/AddToRider';
import { Media } from '@/components/Media';
import { Ph, PhText } from '@/components/Ph';
import { DepositTag, PriceTag } from './PriceTag';

export function ItemCard({ item }: { item: CatalogItem }) {
  const cat = catalog.categories.find((c) => c.id === item.category);
  const dep = item.depositCents === undefined ? 0 : val(item.depositCents);
  return (
    <article className="item" data-category={item.category}>
      <div className="item__img">
        <Media id={item.media} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 45vw, 100vw" />
        <span className="item__cat">{cat?.label}</span>
      </div>
      <div className="item__body">
        <h3>{item.name}</h3>
        <PhText v={item.short} className="item__short" />
        <div className="item__meta">
          <Ph v={item.price}>{(p) => <PriceTag price={p} />}</Ph>
          <DepositTag cents={dep} note={isPlaceholder(item.depositCents) ? item.depositCents.note : undefined} />
          {item.minQty ? <small>min. {item.minQty}</small> : null}
        </div>
        <AddToRider kind="item" id={item.id} qty={item.minQty ?? 1} />
      </div>
    </article>
  );
}

export function PackageCard({ pkg, index }: { pkg: CatalogPackage; index: number }) {
  return (
    <article className={`pkg pkg--${index}`}>
      <div className="pkg__img">
        <Media id={pkg.media} sizes="(min-width: 1000px) 33vw, 100vw" />
      </div>
      <div className="pkg__body">
        <span className="pkg__size">{['S', 'M', 'L'][index] ?? '+'}</span>
        <h3>{pkg.name}</h3>
        <p className="pkg__tag">{pkg.tagline}</p>
        <span className="micro">{pkg.guests}</span>
        <ul>
          {pkg.items.map((pi) => {
            const it = catalog.items.find((i) => i.id === pi.itemId);
            return it ? (
              <li key={pi.itemId}>
                <b>{pi.qty}×</b> {it.name}
              </li>
            ) : null;
          })}
        </ul>
        <div className="pkg__foot">
          <Ph v={pkg.price}>{(p) => <PriceTag price={p} />}</Ph>
          <AddToRider kind="package" id={pkg.id} />
        </div>
      </div>
    </article>
  );
}
