import { expect, test } from '@playwright/test';

/** Hauptflow: Leistung → Rider → Anfrage mit Kategorie + Kalenderdatum → Danke → Mails im Cockpit. */
test('Hauptflow von der Leistung bis ins Demo-Postfach', async ({ page, request }) => {
  await request.post('/api/demo/reset');
  await page.addInitScript(() => sessionStorage.setItem('cev-intro-seen', '1'));

  await page.goto('/leistungen/bar-catering');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bar-Catering');

  // Artikel in den Rider
  const add = page.locator('.items .add').first();
  await add.scrollIntoViewIfNeeded();
  await add.click();
  await expect(add).toContainText('Im Rider');

  // Über den Rider zur Anfrage
  await page.locator('.rider-fab').click();
  await page.locator('.drawer.is-open').getByRole('link', { name: /Anfrage senden/ }).click();
  await expect(page).toHaveURL(/\/anfrage\?kategorie=konfigurator/);
  await expect(page.locator('.cat.is-on')).toContainText('Rider aus dem Konfigurator');
  await expect(page.locator('.form__rider')).toContainText('Mobile Bar');

  // Freien Tag im Kalender wählen (ggf. nächster Monat)
  let free = page.locator('.cal__day--free:not([disabled])');
  if ((await free.count()) === 0) {
    await page.getByRole('button', { name: 'Nächster Monat' }).click();
    free = page.locator('.cal__day--free:not([disabled])');
  }
  await free.last().click();
  await expect(page.locator('input[name="date"]')).not.toHaveValue('');

  await page.fill('input[name="name"]', 'Playwright Testkunde');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="guests"]', '80');
  await page.locator('input[name="privacy"]').check();
  await page.waitForTimeout(2600); // Spam-Schutz: Mindest-Ausfüllzeit
  await page.getByRole('button', { name: /Anfrage senden/ }).click();

  await expect(page).toHaveURL(/\/anfrage\/danke\?id=/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ist angekommen');
  await expect(page.locator('.thanks__ticket')).toContainText('Mobile Bar');

  // Cockpit: beide Mails + Anfrage
  await page.goto('/demo#postfach');
  await expect(page.locator('.mailbox__list li')).toHaveCount(2);
  await expect(page.locator('.mailbox__list')).toContainText('Neue Anfrage');
  await expect(page.locator('.mailbox__list')).toContainText('Deine Anfrage ist da');
  await page.goto('/demo#anfragen');
  await expect(page.locator('.table')).toContainText('Playwright Testkunde');
});

test('alle Seiten der Sitemap antworten mit 200 und haben eine H1', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>[^<]*?(\/[^<]*)<\/loc>/g)].map((m) => new URL(m[1]!, 'http://x').pathname);
  expect(paths.length).toBeGreaterThan(10);
  for (const p of paths) {
    const res = await page.goto(p);
    expect(res?.status(), p).toBe(200);
    await expect(page.locator('h1').first(), p).toBeAttached();
  }
  const llms = await request.get('/llms.txt');
  expect(await llms.text()).toContain('## Leistungen');
});
