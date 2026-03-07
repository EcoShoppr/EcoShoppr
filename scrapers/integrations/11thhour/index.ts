import { SquareAdapter } from '../../core/adapters/SquareAdapter.js';

export class EleventhHourScraper extends SquareAdapter {
    constructor() {
        super('11thhour', 'https://www.11thhourcoffee.com/s/order');
    }
}

async function run() {
    const scraper = new EleventhHourScraper();
    await scraper.scrape();
}

if (import.meta.url === `file://${process.argv[1]}`) {
    run().catch(console.error);
}
