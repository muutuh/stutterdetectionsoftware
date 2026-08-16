import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const OUT = 'demo-screenshots/freespeech';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ permissions: ['microphone'] });
const page = await ctx.newPage();
await page.setViewportSize({ width: 1280, height: 800 });

// Login and skip onboarding
await page.goto('http://localhost:5173');
await page.click('text=Get Started');
await page.fill('input[name="email"]', 'demo@fluentpath.com');
await page.fill('input[name="password"]', 'password123');
await page.click('button[type="submit"]');
await page.waitForSelector('text=Welcome aboard!', { timeout: 6000 }).catch(() => {});
const ob = await page.$('text=Welcome aboard!');
if (ob) await page.click('text=Skip for now');
await page.waitForSelector("text=Today's Practice");

// Open Free Speech card
await page.locator('h3:has-text("Free Speech")').click();
await page.waitForSelector('.fixed >> text=What to do');
await page.screenshot({ path: `${OUT}/01-instructions.png` });
console.log('✓ Step 1 — Instructions');

// Go to recording step
await page.locator('.fixed >> text=I\'m Ready').click();
await page.waitForSelector('.fixed >> text=Tap to start recording');
await page.screenshot({ path: `${OUT}/02-recording-idle.png` });
console.log('✓ Step 2 — Recording (idle)');

await browser.close();
console.log(`\nScreenshots saved to ./${OUT}/`);
