export interface StandardizedProduct {
    storeId: string;
    sourceId: string;
    name: string;
    category: string;
    price: number;
    scrapedAt: string;
}

export interface Scraper {
    storeId: string;
    targetUrl: string;
    scrape(): Promise<StandardizedProduct[]>;
}
