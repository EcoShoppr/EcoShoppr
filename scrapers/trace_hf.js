import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('response', async resp => {
        const url = resp.url();
        if (!url.match(/\.(png|woff|woff2|css|js|jpg|svg|gif|webp|ico)(\?.*)?$/)) {
            if (url.includes('products')) {
                const text = await resp.text();
                console.log(`TRACE URL: ${url} -> LENGTH: ${text.length}`);
            } else {
                console.log('TRACE URL:', url);
            }
        }
    });

    await page.goto('https://hidden-fortress-coffee.square.site/s/order', { waitUntil: 'networkidle' });
    await browser.close();
})();
