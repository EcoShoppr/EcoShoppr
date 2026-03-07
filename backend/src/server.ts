import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all products based on an optional search query
app.get('/api/products', async (req, res) => {
    const { q } = req.query;
    try {
        const queryOptions: any = {
            include: {
                raw_item: true
            }
        };

        if (q) {
            queryOptions.where = {
                core_product: {
                    contains: String(q).toLowerCase()
                }
            };
        }

        const products = await prisma.normalizedItem.findMany(queryOptions);
        res.json(products);
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
