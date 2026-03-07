import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { StandardizedProduct, Scraper } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ShopifyAdapter implements Scraper {
    storeId: string;
    baseUrl: string;
    targetUrl: string;

    constructor(storeId: string, baseUrl: string) {
        this.storeId = storeId;
        this.baseUrl = baseUrl.replace(/\/$/, ""); // remove trailing slash
        this.targetUrl = this.baseUrl;
    }

    async scrape(): Promise<StandardizedProduct[]> {
        console.log(`[${this.storeId}] Starting scraping job for ${this.baseUrl}`);

        try {
            const apiUrl = `${this.baseUrl}/products.json?limit=250`;
            console.log(`[${this.storeId}] Fetching products from ${apiUrl}...`);

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`[${this.storeId}] API request failed with status: ${response.status}`);
            }

            const data = await response.json() as { products: any[] };
            if (!data.products || !Array.isArray(data.products)) {
                throw new Error(`[${this.storeId}] Unexpected JSON structure.`);
            }

            const products: StandardizedProduct[] = [];

            for (const productData of data.products) {
                const baseId = productData.id?.toString();
                const baseTitle = productData.title;
                const images = productData.images?.map((img: any) => img.src) || [];

                for (const variant of productData.variants || []) {
                    // For Shopify, properties like Size or Grind are often in the variant title
                    // e.g., "10oz / Whole Bean".
                    // If variant title is "Default Title", we just use the base Title.
                    let finalTitle = baseTitle;
                    if (variant.title && variant.title !== "Default Title") {
                        finalTitle = `${baseTitle} - ${variant.title}`;
                    }

                    // price is a float string e.g. "19.65"
                    const priceStr = variant.price;
                    let priceFloat = 0;
                    if (priceStr) {
                        priceFloat = parseFloat(priceStr);
                    }

                    const product: StandardizedProduct = {
                        storeId: this.storeId,
                        sourceId: variant.id?.toString() || `${baseId}-${Math.random()}`,
                        name: finalTitle,
                        category: productData.product_type || 'Uncategorized',
                        price: priceFloat,
                        scrapedAt: new Date().toISOString()
                    };

                    products.push(product);
                }
            }

            // Save to disk
            const outPath = path.join(__dirname, '../../../data', `${this.storeId}_latest.json`);
            fs.mkdirSync(path.dirname(outPath), { recursive: true });
            fs.writeFileSync(outPath, JSON.stringify(products, null, 2));

            console.log(`[${this.storeId}] Wrote ${products.length} variant items to ${outPath}`);
            return products;

        } catch (error) {
            console.error(`[${this.storeId}] Encountered error during scraping:`);
            console.error(error);
            throw error;
        }
    }
}
