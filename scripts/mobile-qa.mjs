import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
try {
  for (const width of [430, 412, 390, 375, 360]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.hero-scroll').evaluate(el => el.classList.contains('is-static')), true);
    assert.equal(await page.locator('.story-beat').evaluateAll(items => items.every(el => getComputedStyle(el).visibility === 'visible')), true);
    for (const id of ['inicio', 'transformacao', 'metodo', 'canto', 'studio', 'planos', 'contato', 'duvidas']) {
      await page.locator(`#${id}`).evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'instant' }));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}: ${id} overflow`);
    }
    await page.locator('#planos').evaluate(el => scrollTo({ top: el.offsetTop, behavior: 'instant' }));
    await page.waitForFunction(() => !document.querySelector('.mobile-plan-cta').classList.contains('is-visible'));
    const cards = await page.locator('.pricing-card').evaluateAll(items => items.map(el => ({ name: el.querySelector('h3').textContent, top: el.getBoundingClientRect().top })));
    assert.deepEqual(cards.map(c => c.name), ['Básico', 'Premium', 'Pro']);
    assert.ok(cards[0].top < cards[1].top && cards[1].top < cards[2].top);
    await page.getByRole('tab', { name: 'Canto', exact: true }).click();
    await page.locator('.pricing-premium > button').click();
    await page.getByRole('dialog').waitFor();
    assert.match(await page.locator('.checkout-summary').innerText(), /Premium.*Canto/is);
    const summary = await page.locator('.checkout-summary').boundingBox();
    const copy = await page.locator('.checkout-copy').boundingBox();
    assert.ok(summary.y < copy.y, 'Summary should be above payment on mobile');
    for (const label of ['Cartão de crédito', 'Pix Automático', 'Pix', 'Boleto']) {
      const option = page.locator('.payment-options button').filter({ has: page.locator('strong', { hasText: new RegExp(`^${label}$`) }) });
      await option.click();
      assert.equal(await option.getAttribute('aria-pressed'), 'true');
      const box = await option.boundingBox();
      assert.ok(box.height >= 44 && box.x >= 0 && box.x + box.width <= width);
    }
    const link = page.locator('.checkout-primary');
    await link.focus(); await page.keyboard.press('Tab');
    assert.equal(await page.locator('.checkout-close').evaluate(el => el === document.activeElement), true);
    if (width === 390) await page.screenshot({ path: 'artifacts/mobile-checkout.png' });
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').count(), 0);
    assert.equal(await page.locator('.pricing-premium > button').evaluate(el => el === document.activeElement), true, 'Restore focus to selected plan');
    assert.equal(await page.locator('main').getAttribute('inert'), null);
    assert.ok(await page.evaluate(() => window.dataLayer.some(e => e.event === 'checkout_started')));
    console.log(`${width}px: sections, pricing, payments, modal focus, CTA passed`);
    await page.close();
  }
  const landscape = await browser.newPage({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true });
  await landscape.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  assert.equal(await landscape.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.equal(await landscape.locator('.hero').evaluate(el => getComputedStyle(el).position), 'relative');
  await landscape.screenshot({ path: 'artifacts/mobile-landscape.png' });
  await landscape.close();
  assert.deepEqual(errors, []);
  console.log('Landscape and browser errors passed.');
} finally { await browser.close(); }
