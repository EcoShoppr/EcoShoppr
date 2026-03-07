import { chromium } from 'playwright';
import * as fs from 'fs';
async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://coffeetopia.square.site/', { waitUntil: 'domcontentloaded' });
    const content = await page.content();
    fs.writeFileSync('site_dump.html', content);
    await browser.close();
}
run();
