import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';

const OUT = 'demo-screenshots';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });

// 1. Landing page
await page.goto('http://localhost:5173');
await page.waitForSelector('text=Welcome to FluentPath');
await page.screenshot({ path: `${OUT}/01-landing.png`, fullPage: false });
console.log('✓ Landing');

// 2. Login page
await page.click('text=Get Started');
await page.waitForSelector('text=Welcome Back');
await page.screenshot({ path: `${OUT}/02-login.png`, fullPage: false });
console.log('✓ Login');

// 3. Fill login and submit (onboarding fires first — skip it)
await page.fill('input[name="email"]', 'demo@fluentpath.com');
await page.fill('input[name="password"]', 'password123');
await page.click('button[type="submit"]');
// May land on onboarding wizard — skip if present
await page.waitForSelector('text=Welcome aboard!, text=Today\'s Practice', { timeout: 5000 }).catch(() => {});
const onboarding = await page.$('text=Welcome aboard!');
if (onboarding) {
  await page.click('text=Skip for now');
}
await page.waitForSelector("text=Today's Practice", { timeout: 10000 });
await page.screenshot({ path: `${OUT}/03-dashboard.png`, fullPage: false });
console.log('✓ Dashboard');

// 4. Open an exercise modal — click the card div itself
await page.locator('h3:has-text("Turtle Pace")').click();
await page.waitForSelector('.fixed >> text=Instructions', { timeout: 10000 });
await page.screenshot({ path: `${OUT}/04-exercise-modal.png`, fullPage: false });
console.log('✓ Exercise modal');
// close via X button
await page.locator('.fixed button:has(svg)').first().click();

// 5. Statistics
await page.click('text=Statistics');
await page.waitForSelector("text=Your Progress");
await page.screenshot({ path: `${OUT}/05-statistics.png`, fullPage: false });
console.log('✓ Statistics');

// 6. Assessment
await page.click('text=Assessment');
await page.waitForSelector('text=Speech Assessment');
await page.screenshot({ path: `${OUT}/06-assessment.png`, fullPage: false });
console.log('✓ Assessment');

// 7. Settings (via user menu)
await page.click('[aria-label="User menu"]');
await page.waitForSelector('text=Settings');
await page.locator('text=Settings').last().click();
await page.waitForSelector('text=Account');
await page.screenshot({ path: `${OUT}/07-settings.png`, fullPage: false });
console.log('✓ Settings');

await browser.close();
console.log(`\nAll screenshots saved to ./${OUT}/`);
