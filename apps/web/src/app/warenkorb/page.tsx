import { val } from '@c-event/core';
import { cartPage, shop } from '@c-event/content';
import { CartTicket } from '@/components/cart/CartTicket';
import { pageMeta } from '@/lib/seo';

export const metadata = { ...pageMeta({ ...cartPage.seo, path: '/warenkorb' }), robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <header className="page-head page-head--small">
        <span className="eyebrow">{cartPage.kicker}</span>
        <h1 className="page-head__title">{val(shop.cartLabel)}</h1>
        <p className="page-head__lead">{cartPage.lead}</p>
      </header>
      <section className="sec sec--tight cart-page">
        <CartTicket variant="page" />
      </section>
    </>
  );
}
