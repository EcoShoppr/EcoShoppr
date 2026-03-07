import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { normalizeGroceryName } from './pipeline';

const prisma = new PrismaClient();

async function ingestScrapedData(filePath: string) {
    console.log(`Reading scraped data from ${filePath}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    let successCount = 0;

    // For demonstration, let's limit to 10 items so we don't spam the LLM 
    // API excessively right now while testing.
    const limit = Math.min(data.length, 10);
    console.log(`Processing first ${limit} items for demonstration...`);

    for (let i = 0; i < limit; i++) {
        const item = data[i];

        console.log(`\n-- [${i + 1}/${limit}] Ingesting: ${item.name} --`);

        // 1. Insert into RawScrapedItem
        const rawResult = await prisma.rawScrapedItem.create({
            data: {
                store_id: item.storeId,
                raw_name: item.name,
                raw_price: item.price,
                raw_url: null,
                processing_status: 'PENDING'
            }
        });

        // 2. Normalize and extract attributes via LLM
        try {
            const normalized = await normalizeGroceryName(item.name);

            if (normalized) {
                await prisma.normalizedItem.create({
                    data: {
                        raw_item_id: rawResult.id,
                        brand: normalized.brand || null,
                        core_product: normalized.core_product,
                        attributes: normalized.attributes || [],
                        size_value: normalized.size_value || null,
                        size_unit: normalized.size_unit || null
                    }
                });

                await prisma.rawScrapedItem.update({
                    where: { id: rawResult.id },
                    data: { processing_status: 'PROCESSED' }
                });
                console.log(`  ✓ Normalized to: ${normalized.core_product} (Attributes: ${normalized.attributes.join(', ')})`);
                successCount++;
            } else {
                await prisma.rawScrapedItem.update({
                    where: { id: rawResult.id },
                    data: { processing_status: 'FAILED' }
                });
                console.log(`  ✗ Failed to normalize`);
            }
        } catch (e) {
            console.error(`  ✗ Error processing ${item.name}:`, e);
            await prisma.rawScrapedItem.update({
                where: { id: rawResult.id },
                data: { processing_status: 'FAILED' }
            });
        }

        // Sleep briefly to respect API rate limits
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\nIngestion complete. Normalized ${successCount}/${limit} items evaluated.`);
}

// Example usage if executed directly
if (require.main === module) {
    const fileToIngest = process.argv[2];
    if (!fileToIngest) {
        console.error("Please provide a path to a JSON file to ingest.");
        console.error("Usage: npx ts-node src/ingest.ts ../scrapers/data/coffeetopia_latest.json");
        process.exit(1);
    }

    ingestScrapedData(fileToIngest).then(() => {
        prisma.$disconnect();
    }).catch(e => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
}
