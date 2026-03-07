import { SquareAdapter } from '../../core/adapters/SquareAdapter.js';

export class HiddenFortressScraper extends SquareAdapter {
    constructor() {
        super('hiddenfortress', 'https://hidden-fortress-coffee.square.site/s/order');
    }
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
    const scraper = new HiddenFortressScraper();
    scraper.scrape().catch(console.error);
}
