import { chromium, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { Scraper, StandardizedProduct } from '../../core/types';

export class CoffeetopiaScraper implements Scraper {
    storeId = 'coffeetopia';
    targetUrl = 'https://coffeetopiainc.square.site/s/order';

    async scrape(): Promise<StandardizedProduct[]> {
        console.log(`[${this.storeId}] Starting scraping job for ${this.targetUrl}`);
        const browser = await chromium.launch({ headless: true });

        // Use an iPhone user agent since mobile views are sometimes simpler or more reliable to auto-scroll
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        });

        const page = await context.newPage();
        const collectedProducts: StandardizedProduct[] = [];

        page.on('response', async (response) => {
            const url = response.url();
            // Square often loads category/item data through specific GraphQL endpoints or REST endpoints like /api/v1/items
            if (url.includes('api/v1/...') || url.includes('items') || url.includes('graphql')) {
                // Need to refine this interceptor logic based on runtime observation
            }
        });

        console.log(`[${this.storeId}] Navigating...`);
        await page.goto(this.targetUrl, { waitUntil: 'networkidle' });

        // We will attempt to parse the DOM or embedded State depending on how Square loads
        // For Square sites, the initial state is often embedded in a <script id="bootstrap-data"> or similar

        const products = await this.extractFromScriptTag(page);

        if (products.length > 0) {
            collectedProducts.push(...products);
        } else {
            console.log(`[${this.storeId}] Failed to find embedded script data, falling back to DOM parsing.`);
            // Placeholder for DOM parsing if needed
        }

        await browser.close();

        // Save to data directory
        const dataDir = path.resolve(__dirname, '../../../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const outputPath = path.join(dataDir, `${this.storeId}_latest.json`);
        fs.writeFileSync(outputPath, JSON.stringify(collectedProducts, null, 2));
        console.log(`[${this.storeId}] Wrote ${collectedProducts.length} items to ${outputPath}`);

        return collectedProducts;
    }

    // Attempt to find Square's embedded hydration payload
    private async extractFromScriptTag(page: Page): Promise<StandardizedProduct[]> {
        return await page.evaluate(() => {
            const items: any[] = [];
            // This is speculative until we observe the live site's DOM structure
            // Often it's something like window.__INITIAL_STATE__
            const scripts = Array.from(document.querySelectorAll('script'));
            for (const script of scripts) {
                if (script.textContent && script.textContent.includes('window.StorefrontContext')) {
                    try {
                        // Very rough extraction, usually better done via Regex on the raw text
                        const match = script.textContent.match(/window\.StorefrontContext\s*=\s*({.*});?/);
                        if (match && match[1]) {
                            const data = JSON.parse(match[1]);
                            // Would parse data here
                            console.log("Found StorefrontContext");
                        }
                    } catch (e) {
                        console.error("Failed to parse", e);
                    }
                }
            }
            return items;
        });
    }
}

// Execute if run directly
if (require.main === module) {
    const scraper = new CoffeetopiaScraper();
    scraper.scrape().catch(console.error);
}
