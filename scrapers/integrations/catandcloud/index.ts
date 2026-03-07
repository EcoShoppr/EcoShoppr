import { ShopifyAdapter } from '../../core/adapters/ShopifyAdapter.js';

export class CatAndCloudScraper extends ShopifyAdapter {
    constructor() {
        super('catandcloud', 'https://catandcloud.com');
    }
}

async function run() {
    const scraper = new CatAndCloudScraper();
    await scraper.scrape();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run().catch(console.error);
}
