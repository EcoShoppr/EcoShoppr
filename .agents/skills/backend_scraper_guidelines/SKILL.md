---
description: EcoShoppr Backend & Scraper Automation Guidelines
---

# Backend & Scraper Automation Guidelines

This skill governs the integration between the external data scrapers (found in `/scrapers`) and the core API and Database (found in `/backend`).

## 1. Scraper Architecture (Playwright)
The EcoShoppr scrapers are built on Node.js + Playwright to handle dynamic, JavaScript-rendered store pages.

- **Modularity:** Each store must have its own isolated integration script (e.g., `/scrapers/src/integrations/store_name/index.ts`).
- **Headless Execution:** Scrapers must run in headless mode by default for production server compatibility.
- **Robust Selectors:** Avoid brittle CSS selectors (e.g., `#main > div:nth-child(2) > span.price`). Prioritize data attributes (e.g., `data-test-id="product-price"`), ARIA labels, or text content where possible.

## 2. Error Handling & Graceful Failure
Store websites update frequently. Scrapers **will** break. The architecture must account for this:
- **Never Crash Silently:** Wrap critical extraction logic in `try/catch` blocks.
- **Alerting:** When a selector fails repeatedly, the scraper should log a structured error (e.g., `STORE_LAYOUT_CHANGED`) and exit gracefully, notifying the maintainer rather than polluting the database with `null` values.
- **Partial Success:** If 90% of items on a page parse correctly but 10% fail, log the 10% failures but still commit the 90% successes to the database.

## 3. Pushing Data to the Backend
Scrapers do **not** interact directly with the Prisma database. They must communicate via the `/backend` API.

- **API First:** Scrapers should construct a clean JSON payload of `{ storeId, items: [{ rawName, price, url, image }] }` and `POST` it to an internal backend endpoint (e.g., `/api/ingest`).
- **Batching:** Send data in batches (e.g., 50-100 items per request) to avoid overwhelming the Node backend or hitting payload size limits.

## 4. Database Schema (Prisma)
The backend uses Prisma. The core flow is:
1. Receive Raw Data from scraper.
2. Run Normalization (see Item Normalization System skill).
3. Upsert `Store` -> Upsert `Product` (Canonical) -> Insert `Price` history record.

**DO NOT** overwrite existing canonical products unless explicitly instructed by a high-confidence normalization pass.
