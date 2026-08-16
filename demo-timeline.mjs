import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const OUT = 'demo-screenshots/freespeech';
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
const ctx = await browser.newContext({ permissions: ['microphone'] });
const page = await ctx.newPage();
page.on('console', m => { if (m.type() === 'error') console.error('PAGE:', m.text()); });
page.on('pageerror', e => console.error('PAGEERR:', e.message));
await page.setViewportSize({ width: 1280, height: 800 });

// Login and skip onboarding
await page.goto('http://localhost:5173');
await page.click('text=Get Started');
await page.fill('input[name="email"]', 'demo@fluentpath.com');
await page.fill('input[name="password"]', 'password123');
await page.click('button[type="submit"]');
const ob = await page.waitForSelector('text=Welcome aboard!, text=Today\'s Practice', { timeout: 6000 }).catch(() => null);
if (await page.$('text=Welcome aboard!')) await page.click('text=Skip for now');
await page.waitForSelector("text=Today's Practice");

// Open Free Speech modal
await page.locator('h3:has-text("Free Speech")').click();
await page.waitForSelector('.fixed >> text=What to do');

// Inject mock results directly into React state via window eval
// We'll bypass actual recording by directly calling the component internals via React DevTools trick.
// Instead, navigate to step 3 by injecting freeSpeechResults into the page state using a custom event.
await page.evaluate(() => {
  // Simulate what the API would return by patching fetch for the stutter-analyze Edge Function
  window._originalFetch = window.fetch;
  window.fetch = async (url, opts) => {
    if (url.includes('/functions/v1/stutter-analyze')) {
      return new Response(JSON.stringify({
        success: true,
        duration: 28.5,
        segments: [
          { segment: 0, start_time: 0.0,  end_time: 3.0,  label: 'no_stutter', confidence: 0.91 },
          { segment: 1, start_time: 3.0,  end_time: 6.0,  label: 'stutter',    confidence: 0.83 },
          { segment: 2, start_time: 6.0,  end_time: 9.0,  label: 'no_stutter', confidence: 0.88 },
          { segment: 3, start_time: 9.0,  end_time: 12.0, label: 'no_stutter', confidence: 0.94 },
          { segment: 4, start_time: 12.0, end_time: 15.0, label: 'stutter',    confidence: 0.76 },
          { segment: 5, start_time: 15.0, end_time: 18.0, label: 'no_stutter', confidence: 0.89 },
          { segment: 6, start_time: 18.0, end_time: 21.0, label: 'no_stutter', confidence: 0.92 },
          { segment: 7, start_time: 21.0, end_time: 24.0, label: 'stutter',    confidence: 0.71 },
          { segment: 8, start_time: 24.0, end_time: 27.0, label: 'no_stutter', confidence: 0.87 },
          { segment: 9, start_time: 27.0, end_time: 28.5, label: 'no_stutter', confidence: 0.95 },
        ]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return window._originalFetch(url, opts);
  };

  // Also mock getUserMedia so the recording starts without a real mic
  navigator.mediaDevices.getUserMedia = async () => {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();
    return dest.stream;
  };
});

// Patch fetch + getUserMedia BEFORE the recording step loads
await page.evaluate(() => {
  // Return real audio via oscillator so MediaRecorder gets data
  navigator.mediaDevices.getUserMedia = async () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const dest = ctx.createMediaStreamDestination();
    osc.connect(dest);
    osc.start();
    return dest.stream;
  };

  // Return mock API response
  const _fetch = window.fetch.bind(window);
  window.fetch = async (url, opts) => {
    if (typeof url === 'string' && url.includes('/functions/v1/stutter-analyze')) {
      return new Response(JSON.stringify({
        success: true,
        duration: 28.5,
        segments: [
          { segment: 0, start_time: 0.0,  end_time: 3.0,  label: 'no_stutter', confidence: 0.91 },
          { segment: 1, start_time: 3.0,  end_time: 6.0,  label: 'stutter',    confidence: 0.83 },
          { segment: 2, start_time: 6.0,  end_time: 9.0,  label: 'no_stutter', confidence: 0.88 },
          { segment: 3, start_time: 9.0,  end_time: 12.0, label: 'no_stutter', confidence: 0.94 },
          { segment: 4, start_time: 12.0, end_time: 15.0, label: 'stutter',    confidence: 0.76 },
          { segment: 5, start_time: 15.0, end_time: 18.0, label: 'no_stutter', confidence: 0.89 },
          { segment: 6, start_time: 18.0, end_time: 21.0, label: 'no_stutter', confidence: 0.92 },
          { segment: 7, start_time: 21.0, end_time: 24.0, label: 'stutter',    confidence: 0.71 },
          { segment: 8, start_time: 24.0, end_time: 27.0, label: 'no_stutter', confidence: 0.87 },
          { segment: 9, start_time: 27.0, end_time: 28.5, label: 'no_stutter', confidence: 0.95 },
        ],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return _fetch(url, opts);
  };
});

// Go to recording step
await page.locator('.fixed >> text=I\'m Ready').click();
await page.waitForSelector('.fixed >> text=Tap to start recording');

// Start recording — the big round mic button has class p-8
const micBtn = page.locator('.fixed button.p-8');
await micBtn.click();
await page.waitForTimeout(1000);
await page.screenshot({ path: `${OUT}/debug-after-click.png` });
const bodyText = await page.locator('.fixed').innerText();
console.log('Modal text after click:', bodyText.slice(0, 200));
await page.waitForSelector('.fixed >> text=Recording', { timeout: 4000 });
await page.screenshot({ path: `${OUT}/02b-recording-active.png` });
console.log('✓ Step 2 — Recording active');

// Wait past the 5-second minimum lock, then stop
await page.waitForTimeout(6200);
await micBtn.click();

// Wait for API response + results render
await page.waitForSelector('.fixed >> text=When Stutters Happened', { timeout: 15000 });
await page.screenshot({ path: `${OUT}/03-results-timeline.png`, fullPage: false });
console.log('✓ Step 3 — Results with timeline');

await browser.close();
