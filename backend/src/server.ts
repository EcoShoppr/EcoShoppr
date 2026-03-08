import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint to test Express
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all products based on an optional search query
app.get('/api/products', async (req, res) => {
    let { q } = req.query;
    try {
        const queryOptions: any = {
            include: {
                raw_item: true
            },
            take: 50 // Limit to 50 results so we don't overwhelm the UI
        };

        if (q && typeof q === 'string') {
            const queryClean = q.trim();
            if (queryClean) {
                const words = queryClean.split(/\s+/).filter(w => w.length > 0);

                // Smart Search: Ensure ALL words match SOMETHING (AND condition)
                // Each word can match core_product OR brand OR attributes
                queryOptions.where = {
                    AND: words.map(word => ({
                        OR: [
                            {
                                core_product: {
                                    contains: word,
                                    mode: 'insensitive'  // PostgreSQL specific
                                }
                            },
                            {
                                brand: {
                                    contains: word,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                attributes: {
                                    has: word.toLowerCase()
                                }
                            }
                        ]
                    }))
                };
            }
        }

        const products = await prisma.normalizedItem.findMany(queryOptions);

        // Map the results to precisely match what ProductCard expects
        const mappedProducts = products.map((product: any) => ({
            id: product.id,
            core_product: product.core_product,
            location_source: product.raw_item?.store_id || 'Unknown Store',
            normalized_name: product.core_product,
            raw_item: {
                // Return price in cents to align with (product.raw_item.price / 100) in frontend
                price: product.raw_item ? Math.round(product.raw_item.raw_price * 100) : undefined,
                // Optional category or availability mapping can go here in the future
            }
        }));

        res.json(mappedProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Backend API Server running on http://localhost:${port}`);
    });
}

export default app;
