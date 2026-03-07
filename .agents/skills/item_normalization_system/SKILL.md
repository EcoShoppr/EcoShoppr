---
description: EcoShoppr Item Normalization System Architecture
---

# Item Normalization System

This skill details the approach and architecture for standardizing product data scraped from various sources into the EcoShoppr database.

## 1. The Core Problem
Different local grocery stores use vastly different naming conventions for the same products. 
- Store A: `Organic Fuji Apples 1lb Bag`
- Store B: `Apples, Fuji, Org.`
- Store C: `Fuji Apple (Organic) - 16oz`

To allow users to accurately compare prices, the backend must cluster or normalize these diverse strings into a single canonical `Product` entity.

## 2. The Solution: AI-Assisted Normalization
EcoShoppr uses an AI-driven pipeline (leveraging `@google/genai` or similar fast, cheap LLMs/Embedding models) during the data ingestion phase.

### Step 1: Ingestion & Raw Data Storage
When a scraper pushes data to the backend, it is saved as "Raw Data" linked to a specific `Store`. This raw data is never mutated directly. 

### Step 2: Normalization Pipeline
1. **Fuzzy Matching / Embeddings (Fast Pass):** The system first attempts to match the raw item name against existing canonical `Products` in the database using vector embeddings or robust fuzzy matching. If similarity is above a high confidence threshold (e.g., > 95%), it automatically links the price.
2. **LLM Resolution (Slow Pass):** If no high-confidence match is found, the raw item name, category, and store details are sent to a small LLM (like Gemini Flash).
   - **Prompt Goal:** Instruct the LLM to either match the item to a provided list of "likely candidates" or extract the core noun, brand, and modifier to create a *new* canonical `Product`.
   - **Output:** Structured JSON containing the canonical name, brand, size/weight, and organic status.

### Step 3: Canonical Linking
The backend updates the database, linking the newly scraped `Price` to the resolved canonical `Product` ID.

## 3. Implementation Guidelines
- **Modularity:** The normalization logic must be isolated in the `backend`. Scrapers (in the `scrapers` repo) should purely focus on extracting HTML data; they should not attempt to normalize text themselves.
- **Cost & Speed:** The normalization pass must be heavily optimized to avoid massive API bills when scraping thousands of items. Utilize batching and caching heavily.
- **Human in the Loop:** Always maintain a fallback where low-confidence LLM outputs flag an item for manual review in an admin dashboard rather than blindly merging distinct products.
