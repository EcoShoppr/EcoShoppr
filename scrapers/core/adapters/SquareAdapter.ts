import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Scraper, StandardizedProduct } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SquareAdapter implements Scraper {
    storeId: string;
    targetUrl: string;

    constructor(storeId: string, targetUrl: string) {
        this.storeId = storeId;
        this.targetUrl = targetUrl;
    }

    async scrape(): Promise<StandardizedProduct[]> {
        console.log(`[${this.storeId}] Starting scraping job for ${this.targetUrl}`);

        console.log(`[${this.storeId}] Fetching storefront HTML...`);
        const response = await fetch(this.targetUrl);
        const html = await response.text();

        const match = html.match(/window\.__BOOTSTRAP_STATE__\s*=\s*({.+?});/);
        if (!match || !match[1]) {
            throw new Error(`[${this.storeId}] Failed to find __BOOTSTRAP_STATE__ in HTML payload.`);
        }

        const state = JSON.parse(match[1]);

        const siteId = state.siteData?.site?.id;
        const classicSiteId = state.siteData?.site?.properties?.classicSiteID;
        let userId = state.siteData?.site?.user_id || state.user?.id;

        // Fallback for userId: sometimes it's located in the window._W.Analytics block
        if (!userId) {
            const userMatch = html.match(/user_id:\s*['"](\d+)['"]/);
            if (userMatch && userMatch[1]) {
                userId = userMatch[1];
            } else {
                throw new Error(`[${this.storeId}] Could not find user_id dynamically.`);
            }
        }

        const storeLocations = state.storeLocations?.locations || [];
        const locationId = storeLocations[0]?.id || state.storeInfo?.shipping_location_ids?.[0];

        if (!classicSiteId || !locationId) {
            throw new Error(`[${this.storeId}] Missing required API parameters: classicSiteId=${classicSiteId}, locationId=${locationId}`);
        }

        console.log(`[${this.storeId}] Extracted IDs - User: ${userId}, Site: ${classicSiteId}, Location: ${locationId}`);

        const apiUrl = `https://cdn5.editmysite.com/app/store/api/v28/editor/users/${userId}/sites/${classicSiteId}/store-locations/${locationId}/products?page=1&per_page=200&include=images,discounts,media_files&cache-version=2023-11-13`;

        console.log(`[${this.storeId}] Fetching product catalog from Square API...`);
        const apiResponse = await fetch(apiUrl);
        if (!apiResponse.ok) {
            throw new Error(`[${this.storeId}] API request failed with status: ${apiResponse.status}`);
        }
        const apiData = await apiResponse.json();

        const products = apiData.data || [];
        const collectedProducts: StandardizedProduct[] = [];

        for (const item of products) {
            const name = item.name;
            const priceInfo = item.price;

            const rawPrice = priceInfo?.high || priceInfo?.low || '0';
            const price = parseFloat(rawPrice);

            collectedProducts.push({
                storeId: this.storeId,
                sourceId: item.id,
                name: name,
                category: "Uncategorized",
                price: price,
                scrapedAt: new Date().toISOString()
            });
        }

        // Project root / data directory
        const dataDir = path.resolve(__dirname, '../../../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const outputPath = path.join(dataDir, `${this.storeId}_latest.json`);
        fs.writeFileSync(outputPath, JSON.stringify(collectedProducts, null, 2));
        console.log(`[${this.storeId}] Wrote ${collectedProducts.length} items to ${outputPath}`);

        return collectedProducts;
    }
}
