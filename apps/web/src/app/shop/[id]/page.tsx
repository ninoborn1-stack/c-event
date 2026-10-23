import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isPlaceholder, val } from '@c-event/core';
import { catalog, getService, shop, shopPage } from '@c-event/content';
import { AddToCart } from '@/components/cart/AddToCart';
import { Media } from '@/components/Media';
import { Ph, PhText } from '@/components/Ph';
import { DepositTag, PriceTag } from '@/components/shop/PriceTag';
import { ProductCard } from '@/components/shop/ProductCard';
import { pageMeta } from '@/lib/seo';

const find = (id: string) => catalog.items.find((i) => i.id === id) ?? catalog.packages.find((p) => p.id === id);

export function generateStaticParams() {
  return [...catalog.items, ...catalog.packages].map((x) => ({ id: x.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const x = find((await params).id);
  if (!x) return {};
  const desc = 'tagline' in x ? x.tagline : val(x.short);
  return pageMeta({ title: x.name, description: `${desc} – unverbindlich anfragen.`, path: `${shop.path}/${x.id}`, image: x.media });
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const x = find((await params).id);
  if (!x) notFound();
  const isPkg = 'items' in x;
  const related = catalog.items.filter((i) => i.id !== x.id && i.services.some((s) => x.services.includes(s))).slice(0, 3);
  return (
    <>
      <article className="pdp">
        <div className="pdp__img">
          <Media id={x.media} priority sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
        <div className="pdp__body">
          <Link href={shop.path} className="pdp__back">
            ← {shopPage.detail.back}
          </Link>
          <h1 className="page-head__title page-head__title--m">{x.name}</h1>
          {isPkg ? <p className="pdp__lead">{x.tagline}</p> : <PhText v={x.short} className="pdp__lead" />}
          <div className="pdp__price">
            <PriceTag price={val(x.price)} />
            {!isPkg && <DepositTag cents={x.depositCents === undefined ? 0 : val(x.depositCents)} note={isPlaceholder(x.depositCents) ? x.depositCents.note : undefined} />}
          </div>
          <dl className="pdp__facts">
            {isPkg ? (
              <div>
                <dt>{shopPage.detail.includes}</dt>
                <dd>
                  <ul>
                    {x.items.map((pi) => {
                      const it = catalog.items.find((i) => i.id === pi.itemId);
                      return it ? (
                        <li key={pi.itemId}>
                          {pi.qty}× <Link href={`${shop.path}/${it.id}`}>{it.name}</Link>
                        </li>
                      ) : null;
                    })}
                  </ul>
                </dd>
              </div>
            ) : (
              <>
                <div>
                  <dt>{shopPage.detail.stock}</dt>
                  <dd>
                    <Ph v={x.stock}>{(n) => `${n} Stück`}</Ph>
                  </dd>
                </div>
                {x.minQty && (
                  <div>
                    <dt>{shopPage.detail.minQty}</dt>
                    <dd>{x.minQty}</dd>
                  </div>
                )}
              </>
            )}
            <div>
              <dt>{shopPage.detail.fits}</dt>
              <dd>
                {x.services.map((s) => {
                  const sv = getService(s);
                  return sv ? (
                    <Link key={s} href={`/leistungen/${s}`} className="pill">
                      {sv.name}
                    </Link>
                  ) : null;
                })}
              </dd>
            </div>
          </dl>
          <AddToCart kind={isPkg ? 'package' : 'item'} id={x.id} qty={!isPkg ? (x.minQty ?? 1) : 1} size="md" />
          <small className="muted">{shopPage.note}</small>
        </div>
      </article>
      {related.length > 0 && (
        <section className="sec sec--cream sec--tight">
          <h2 className="h-m">{shopPage.detail.fits}</h2>
          <div className="products">
            {related.map((r) => (
              <ProductCard key={r.id} item={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
