// Sharp screen capture via CDP screencast. Usage: node cast.js <flow> <outdir>
const { chromium } = require('playwright');
const fs = require('fs');
const [flow, out] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 2.77, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  const frames = []; let t0 = null;
  cdp.on('Page.screencastFrame', async (e) => {
    const ts = e.metadata.timestamp; if (t0 === null) t0 = ts;
    const n = String(frames.length).padStart(5, '0');
    fs.writeFileSync(`${out}/f${n}.jpg`, Buffer.from(e.data, 'base64'));
    frames.push({ n, t: ts - t0 });
    await cdp.send('Page.screencastFrameAck', { sessionId: e.sessionId }).catch(() => {});
  });
  const go = async (url) => { await p.goto(url, { waitUntil: 'networkidle' }); };
  const scroll = async (to, ms) => { const from = await p.evaluate(() => scrollY); const steps = Math.round(ms / 16); for (let i = 1; i <= steps; i++) { await p.evaluate((y) => scrollTo(0, y), from + (to - from) * (0.5 - 0.5 * Math.cos(Math.PI * i / steps))); await p.waitForTimeout(16); } };
  const start = () => cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
  const marks = {}; const mark = (k) => { marks[k] = frames.length ? frames[frames.length - 1].t : 0; };
  if (flow === 'portfolio' || flow === 'portfolio-guide') {
    await go('https://starxmarketing.com/' + flow); await start(); mark('start');
    await p.waitForTimeout(3000);
    const h = await p.evaluate(() => document.body.scrollHeight);
    await scroll(Math.min(h - 693, flow === 'portfolio' ? 9000 : 3000), 20000); await p.waitForTimeout(1200);
  } else if (flow === 'prompts') {
    await go('https://starxmarketing.com/prompts'); await start(); await p.waitForTimeout(2500); mark('top');
    await scroll(4500, 24000); mark('scrolled');
    const btn = p.getByRole('button', { name: /Copy prompt/ }).first(); await btn.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); mark('copy'); await btn.click().catch(() => {}); await p.waitForTimeout(2000);
  } else if (flow === 'check') {
    await go('https://starxmarketing.com/ai'); const inp = p.locator('input[placeholder="yourbrand.com"]'); await inp.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -150));
    await start(); await p.waitForTimeout(800); mark('typing');
    await inp.click(); await inp.pressSequentially('starxmarketing.com', { delay: 60 });
    await p.getByRole('button', { name: 'Check my website' }).click(); mark('checking');
    await p.locator('text=What to fix first').first().waitFor({ timeout: 90000 }).catch(() => {}); await p.waitForTimeout(1000); mark('result');
    await p.evaluate(() => { const el = [...document.querySelectorAll('h1,h2,h3,p,div')].find(e => /Speed|SEO/.test(e.textContent) && e.getBoundingClientRect().top > 0); });
    await scroll((await p.evaluate(() => scrollY)) + 200, 1200); await p.waitForTimeout(2500); mark('scores');
    await scroll((await p.evaluate(() => scrollY)) + 900, 3000); await p.waitForTimeout(3000); mark('fix');
  }
  await cdp.send('Page.stopScreencast');
  // concat list with real durations
  let list = '';
  for (let i = 0; i < frames.length; i++) { const d = (frames[i + 1]?.t ?? frames[i].t + 0.5) - frames[i].t; list += `file 'f${frames[i].n}.jpg'\nduration ${Math.max(0.001, d).toFixed(4)}\n`; }
  list += `file 'f${frames[frames.length - 1].n}.jpg'\n`;
  fs.writeFileSync(`${out}/list.txt`, list);
  fs.writeFileSync(`${out}/marks.json`, JSON.stringify(marks));
  console.log(flow, frames.length, 'frames', JSON.stringify(marks));
  await b.close();
})();
