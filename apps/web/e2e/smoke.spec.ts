import { expect, test } from '@playwright/test';

const SERVICES = ['bar-catering', 'personalvermittlung', 'catering', 'event-management', 'event-organisation', 'dekoration', 'equipment-mieten'];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('cev-intro-seen', '1'));
});

/** Hauptflow: Startseite → Leistung → Shop (Kategorie vorausgewählt) → Artikel in den Warenkorb → Warenkorb → Anfrage → Danke → Admin */
test('Hauptflow von der Startseite bis in den Admin', async ({ page, request }) => {
  await request.post('/api/demo/reset');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Leistung über den Bildstreifen öffnen
  const strip = page.locator('.strip__name a[href$="/leistungen/bar-catering"]');
  await strip.scrollIntoViewIfNeeded();
  await strip.click();
  await expect(page).toHaveURL(/\/leistungen\/bar-catering/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bar-Catering');

  // Jeder CTA der Leistungsseite führt in den Shop – mit Kategorie und Herkunft
  await page.locator('.svc-hero__ctas .tk').click();
  await expect(page).toHaveURL(/\/shop\?kategorie=bar&von=bar-catering/);
  await expect(page.locator('.shop-from')).toContainText('Bar-Catering');
  await expect(page.locator('#artikel .chip.is-on')).toContainText('Bar');

  // Artikel „Zum Event hinzufügen“
  const add = page.locator('#artikel .products .add-to-cart').first();
  await add.scrollIntoViewIfNeeded();
  await add.click();
  await expect(add).toContainText('Im Event');
  await expect(page.locator('.cart-btn__stub')).toHaveText('1');

  // Warenkorb: Drawer → eigene Seite
  await page.locator('.cart-btn').click();
  const drawer = page.locator('.drawer.is-open');
  await expect(drawer.locator('.tline')).toHaveCount(1);
  await drawer.getByRole('link', { name: 'Zur Übersicht' }).click();
  await expect(page).toHaveURL(/\/warenkorb/);
  // Notiz zur Position
  await page.locator('.ticket--page .tline__link', { hasText: 'Notiz' }).click();
  await page.locator('.ticket--page .tline__note').fill('Bar bitte in Weiß');
  await page.locator('.ticket--page .tline__note').blur();
  await page.locator('.ticket--page').getByRole('link', { name: /Unverbindliches Angebot anfragen/ }).click();

  // Anfrage
  await expect(page).toHaveURL(/\/anfrage\?kategorie=konfigurator/);
  await expect(page.locator('.cat.is-on')).toContainText('Event aus dem Shop');
  await expect(page.locator('.form__rider')).toContainText('Mobile Bar');
  let free = page.locator('.cal__day--free:not([disabled])');
  if ((await free.count()) === 0) {
    await page.getByRole('button', { name: 'Nächster Monat' }).click();
    free = page.locator('.cal__day--free:not([disabled])');
  }
  await free.last().click();
  await page.fill('input[name="name"]', 'Playwright Testkunde');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="guests"]', '80');
  await page.locator('input[name="privacy"]').check();
  await page.waitForTimeout(2600); // Spam-Schutz: Mindest-Ausfüllzeit
  await page.locator('.form__send button[type="submit"]').click();

  await expect(page).toHaveURL(/\/anfrage\/danke\?id=/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ist angekommen');
  await expect(page.locator('.thanks__ticket')).toContainText('Mobile Bar');

  // Admin: Demo-Login, Anfrage sichtbar, Status ändern, Mails da
  await page.goto('/admin');
  await page.fill('input[name="email"]', 'demo@cn-event.de');
  await page.fill('input[name="password"]', 'demo');
  await page.getByRole('button', { name: /Anmelden/ }).click();
  await expect(page.locator('.inq-list')).toContainText('Playwright Testkunde');
  await page.locator('.inq-row', { hasText: 'Playwright Testkunde' }).click();
  await expect(page.locator('.inq-cart')).toContainText('Bar bitte in Weiß');
  await page.locator('.inq-detail .chip', { hasText: 'In Bearbeitung' }).click();
  await expect(page.locator('.inq-detail .chip.is-on')).toHaveText('In Bearbeitung');
  await page.locator('.admin__tabs button', { hasText: 'Mails' }).click();
  await expect(page.locator('.mailbox__list li')).toHaveCount(2);
});

/** Regression „Unterseiten ließen sich kurz nicht aufrufen“: alle Leistungen direkt und übers Dropdown erreichbar. */
test('alle Leistungs-Unterseiten – direkt und über die Navigation', async ({ page, isMobile }) => {
  for (const slug of SERVICES) {
    const res = await page.goto(`/leistungen/${slug}`);
    expect(res?.status(), slug).toBe(200);
    await expect(page.locator('h1').first(), slug).toBeVisible();
  }
  await page.goto('/galerie');
  for (const slug of SERVICES) {
    if (isMobile) {
      await page.locator('.nav__burger').click();
      await page.locator(`#mobile-menu a[href$="/leistungen/${slug}"]`).click();
    } else {
      const btn = page.locator('.nav__drop > button');
      await btn.hover();
      // Maus wie ein Mensch vom Button über die Lücke zum Panel bewegen
      const link = page.locator(`.nav__panel a[href$="/leistungen/${slug}"]`);
      const bb = (await btn.boundingBox())!;
      await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height + 6, { steps: 4 });
      await link.hover();
      await link.click();
    }
    await expect(page, slug).toHaveURL(new RegExp(`/leistungen/${slug}`));
    await expect(page.locator('h1').first(), slug).toBeVisible();
  }
});

test('Klick auf „Leistungen“ klappt ein per Hover geöffnetes Menü nicht zu', async ({ page, isMobile }) => {
  test.skip(isMobile, 'nur Desktop-Navigation');
  await page.goto('/galerie');
  const btn = page.locator('.nav__drop > button');
  await btn.hover();
  await btn.click();
  await expect(page.locator('.nav__drop.is-open')).toHaveCount(1);
  await expect(page.locator('.nav__panel a').first()).toBeVisible();
});

test('alle Seiten der Sitemap antworten mit 200 und haben eine H1', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>[^<]*?(\/[^<]*)<\/loc>/g)].map((m) => new URL(m[1]!, 'http://x').pathname);
  expect(paths.length).toBeGreaterThan(30);
  for (const p of paths) {
    const res = await page.goto(p);
    expect(res?.status(), p).toBe(200);
    await expect(page.locator('h1').first(), p).toBeAttached();
  }
  expect(await (await request.get('/llms.txt')).text()).toContain('CN Event Agency');
});

/** Regression: Nach dem Umbenennen der Hero-Variante hatte das Foto keine Größe (CSS-Selektor mit altem Namen). */
test('Hero-Foto ist im ersten Fenster sichtbar', async ({ page }) => {
  await page.goto('/');
  const img = page.locator('.hero__img').first();
  await expect(img).toBeVisible();
  const box = await img.boundingBox();
  const vp = page.viewportSize()!;
  expect(box!.width).toBeGreaterThanOrEqual(vp.width);
  expect(box!.height).toBeGreaterThanOrEqual(vp.height * 0.9);
});

test('Hero-Titel steigt schon während des Intros ein, nicht erst danach', async ({ page }) => {
  await page.goto('/');
  // Solange .is-intro gesetzt ist, muss der erste Buchstabe irgendwann in seiner Zeile ankommen
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const hero = document.querySelector('.hero');
          const ch = document.querySelector('.hero__title .ch');
          const line = ch?.parentElement;
          if (!hero || !ch || !line) return 'fehlt';
          const off = ch.getBoundingClientRect().top - line.getBoundingClientRect().top;
          return hero.classList.contains('is-intro') ? (off < 40 ? 'drin' : 'unten') : 'fertig';
        }),
      { timeout: 12000, intervals: [100] },
    )
    .toBe('drin');
});

test('Abende als Plakatwand mit Archiv-Kachel', async ({ page }) => {
  await page.goto('/');
  const bills = page.locator('.bills > .bill');
  await expect(bills).toHaveCount(5);
  const more = page.locator('.bill--more a[href$="/galerie"]');
  await more.scrollIntoViewIfNeeded(); // Reveal blendet erst im Bild ein
  await expect(more).toBeVisible();
});

test('360°-Punkte verschwinden, wenn man in den Hero zurückscrollt', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Mausrad nur am Desktop');
  await page.addInitScript(() => sessionStorage.setItem('cev-intro-seen', '1'));
  await page.goto('/');
  await page.waitForTimeout(3500);
  await page.mouse.move(600, 400);
  const lit = () =>
    page.evaluate(() => {
      const c = document.querySelector<HTMLCanvasElement>('.hero__dots')!;
      const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 3; i < d.length; i += 40) if (d[i]) n++;
      return n;
    });
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(60);
  }
  await expect.poll(lit, { timeout: 8000 }).toBeGreaterThan(0);
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, -160);
    await page.waitForTimeout(40);
  }
  await expect.poll(lit, { timeout: 8000 }).toBe(0);
});
