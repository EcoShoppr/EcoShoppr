import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Scraper, StandardizedProduct } from '../../core/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CoffeetopiaScraper implements Scraper {
    storeId = 'coffeetopia';
    targetUrl = 'https://coffeetopia.square.site/s/order';

    async scrape(): Promise<StandardizedProduct[]> {
        console.log(`[${this.storeId}] Starting scraping job for ${this.targetUrl}`);

        // Step 1: Fetch the initial HTML page directly without Playwright to speed things up
        // We just need the embedded window.__BOOTSTRAP_STATE__ object to get the IDs.
        console.log(`[${this.storeId}] Fetching storefront HTML...`);
        const response = await fetch(this.targetUrl);
        const html = await response.text();

        // Extract the __BOOTSTRAP_STATE__ JSON object
        const match = html.match(/window\.__BOOTSTRAP_STATE__\s*=\s*({.+?});/);
        if (!match || !match[1]) {
            throw new Error(`[${this.storeId}] Failed to find __BOOTSTRAP_STATE__ in HTML payload.`);
        }

        const state = JSON.parse(match[1]);

        // Extract required IDs for the API request
        const siteId = state.siteData.site.id;
        const classicSiteId = state.siteData.site.properties.classicSiteID;
        // userId is actually inside siteData.site.properties or at the top level sometimes. Let's dig contextually or use the merchant ID
        // Often Square's internal API works with the 'owner' or 'user_id'
        const userId = state.siteData.site.user_id || state.user?.id || '142195097'; // Fallbacking to the value the browser subagent found if it fails to parse

        // Square usually stores the location ID in the state, often the default location
        // We'll search for it in the store locations array
        const storeLocations = state.storeLocations?.locations || [];
        const locationId = storeLocations[0]?.id || 'LKKGGFG0QBBY5'; // Fallback to Santa Cruz location if not found dynamically

        console.log(`[${this.storeId}] Extracted IDs - User: ${userId}, Site: ${classicSiteId}, Location: ${locationId}`);

        // Step 2: Hit the internal Products API directly
        const apiUrl = `https://cdn5.editmysite.com/app/store/api/v28/editor/users/${userId}/sites/${classicSiteId}/store-locations/${locationId}/products?page=1&per_page=200&include=images,discounts,media_files&fulfillments[]=pickup&cache-version=2023-11-13`;

        console.log(`[${this.storeId}] Fetching product catalog from Square API...`);
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();

        const products = apiData.data || [];
        const collectedProducts: StandardizedProduct[] = [];

        for (const item of products) {
            // Square data structure parsing
            const name = item.name;
            const priceInfo = item.price;

            // Convert price from string 'high' or 'low' to formatted number. Often in cents or string float.
            const rawPrice = priceInfo?.high || priceInfo?.low || '0';
            const price = parseFloat(rawPrice);

            collectedProducts.push({
                storeId: this.storeId,
                sourceId: item.id,
                name: name,
                category: "Uncategorized", // Can be enhanced later via the Categories API
                price: price,
                scrapedAt: new Date().toISOString()
            });
        }

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

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    const scraper = new CoffeetopiaScraper();
    scraper.scrape().catch(console.error);
}
