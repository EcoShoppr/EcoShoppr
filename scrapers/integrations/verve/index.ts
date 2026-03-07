import { ShopifyAdapter } from '../../core/adapters/ShopifyAdapter.js';

export class VerveScraper extends ShopifyAdapter {
    constructor() {
        super('verve', 'https://www.vervecoffee.com');
    }
}

async function run() {
    const scraper = new VerveScraper();
    await scraper.scrape();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run().catch(console.error);
}
