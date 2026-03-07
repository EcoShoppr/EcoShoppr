import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Uses GEMINI_API_KEY from .env

const itemSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        brand: {
            type: Type.STRING,
            description: "The brand of the product, if any (e.g., 'Driscoll\\'s', 'Safeway', 'Nature\\'s Promise'). Leave null if none.",
            nullable: true
        },
        core_product: {
            type: Type.STRING,
            description: "The main product identifier, normalized to lowercase singular (e.g., 'apple', 'milk', 'egg').",
        },
        attributes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of descriptive attributes (e.g., 'organic', 'fuji', 'whole', 'free range'). Lowercase.",
        },
        size_value: {
            type: Type.NUMBER,
            description: "The numeric size or weight of the product (e.g., 1.5, 12, 16). Leave null if unstated.",
            nullable: true
        },
        size_unit: {
            type: Type.STRING,
            description: "The unit of measurement (e.g., 'lb', 'oz', 'gallon', 'count'). Leave null if unstated.",
            nullable: true
        }
    },
    required: ["core_product", "attributes"],
};

export async function normalizeGroceryName(rawName: string) {
    const prompt = `
    You are a helpful grocery data parsing assistant.
    Given this raw grocery store product name: "${rawName}"
    
    Extract the product information into the specified schema.
    Rules:
    - Put flavor or variety (like 'fuji' or 'gala') into attributes.
    - Normalize 'Org.' or similar abbreviations to 'organic'.
    - Remove sizes or weights from the core product name and put them in size_value and size_unit.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: itemSchema,
                temperature: 0.1,
            }
        });

        if (response.text) {
            const parsed = JSON.parse(response.text);
            return parsed;
        }
        return null;
    } catch (error) {
        console.error("Failed to parse item:", rawName, error);
        return null;
    }
}

// Example usage loop to validate the process
async function runDemo() {
    const examples = [
        "Fuji Apples, Organic, 1lb",
        "Org. Apple (Fuji)",
        "Lucerne Milk Whole 1 Gallon",
        "Driscoll's Strawberries 16 oz",
        "Local Free-Range Eggs 1 Dozen",
        "Safeway SELECT Coffee Beans French Roast 12oz"
    ];

    for (const rawName of examples) {
        console.log(`\n\n--- Processing: ${rawName} ---`);
        const result = await normalizeGroceryName(rawName);
        console.log(JSON.stringify(result, null, 2));
    }
}

// Run the demo if executed directly
if (require.main === module) {
    runDemo();
}
