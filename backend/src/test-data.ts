import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
    console.log('Seeding db with test data...');

    const raw1 = await prisma.rawScrapedItem.create({
        data: {
            store_id: 'coffeetopia',
            raw_name: 'Regular Coffee Latte',
            raw_price: 4.50,
            processing_status: 'PROCESSED'
        }
    });

    await prisma.normalizedItem.create({
        data: {
            raw_item_id: raw1.id,
            core_product: 'Latte',
            brand: 'Coffeetopia',
            attributes: ['hot', 'coffee']
        }
    });

    const raw2 = await prisma.rawScrapedItem.create({
        data: {
            store_id: '11thhour',
            raw_name: 'Oat Milk Latte 12oz',
            raw_price: 5.50,
            processing_status: 'PROCESSED'
        }
    });

    await prisma.normalizedItem.create({
        data: {
            raw_item_id: raw2.id,
            core_product: 'Oat Milk Latte',
            brand: '11th Hour',
            attributes: ['oat', 'milk', 'latte', 'hot']
        }
    });

    console.log('Seeding complete.');
}

seed().catch(e => console.error(e)).finally(() => prisma.$disconnect());
