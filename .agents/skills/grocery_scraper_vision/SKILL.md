---
description: EcoShoppr Vision & Technical Guidelines
---

# EcoShoppr: Grocery & Supermarket Scraper Vision

This skill provides the core context, goals, and technical guidelines for building out the new **EcoShoppr** platform.

## 1. Project Goal & Vision
- **Objective:** Create a scalable web app that aggregates product and pricing data from local supermarkets, grocery stores, cafes, and restaurants.
- **Pilot Area:** Santa Cruz, CA. The initial focus is proving the concept locally before scaling.
- **Value Proposition:** Allow everyday consumers to easily search for and find the cheapest local items, optimizing their grocery budgets. Assist local, small businesses with gaining an online footprint.

## 2. The Core Challenge: Scraping
The hardest part of this application is reliably scraping and automating the ingestion of pricing data from various local stores.

### Scraping Considerations:
- **Resilience:** Store websites frequently change layouts, employ anti-bot measures, or lack structured APIs.
- **Automation:** Scrapers need to run on a schedule (e.g., daily or weekly) to keep prices accurate without manual intervention.
- **Data Normalization:** Different stores will have different naming conventions for the same product (e.g., "Organic Fuji Apples 1lb" vs. "Apples, Fuji, Org"). Normalization is crucial for accurate price comparisons.

### Potential Approaches:
- **Headless Browsers:** Playwright or Puppeteer for sites heavily reliant on dynamic JavaScript.
- **Direct API Interception:** Inspecting network traffic to find hidden, internal APIs used by the store's frontend.
- **LLM-Assisted Extraction:** Utilizing small, fast LLMs (like Gemini Flash) to parse messy HTML or unstructured text into a clean JSON schema if standard CSS selectors fail.

## 3. Web App Technical Stack
- **Frontend Framework:** React + Vite (TypeScript).
- **Styling:** Premium vanilla CSS aesthetic featuring dynamic, smooth animations, dark-mode capability, and modern typography (e.g., Inter/Outfit) to provide a "WOW" factor.
- **Backend/Database:** To be decided, but should easily support geospatial queries (for finding closest/cheapest stores) and handle frequent batch updates from the scraper pipelines.

## 4. Development Workflow
When contributing to EcoShoppr, ensure that:
1. The web app UI remains incredibly polished and user-friendly. Do not make it look like a minimum viable product.
2. Scrapers are built modularly so that adding a new store is simply a matter of adding a new configuration or script, rather than rewriting core logic.
3. Errors from scraping (e.g., a store changing its layout) fail gracefully and alert the maintainer.
