# EcoShoppr Backend Setup

This folder contains the database schema (via Prisma) and the ingestion pipeline logic.

## 1. Setting up PostgreSQL on Mac
Since we chose PostgreSQL, you'll need to run a local instance of the database. The easiest way on macOS is via Homebrew or Postgres.app.

**Using Homebrew:**
1. Install PostgreSQL:
   ```bash
   brew install postgresql@14
   ```
2. Start the service (runs as a background process):
   ```bash
   brew services start postgresql@14
   ```
3. Create the database for EcoShoppr:
   ```bash
   createdb ecoshoppr
   ```

## 2. Environment Variables
Create a `.env` file in the `backend` directory:
```bash
touch .env
```
Add the following variables to `.env` (adjust the username and password as necessary if your local postgres setup differs, by default brew uses your Mac username with no password):

```env
# Change 'mason' to your actual mac username if it's different.
DATABASE_URL="postgresql://mason@localhost:5432/ecoshoppr?schema=public"

# The Gemini LLM used for parsing data
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

## 3. Database Migration
Once the database is running and `.env` is configured, push the Prisma schema to your database to create the tables:
```bash
npx prisma db push
# OR if you prefer to generate migration files:
npx prisma migrate dev --name init
```
This will also generate the Prisma client which you can use in your application.

## 4. Testing the Pipeline
You can test the Gemini standardisation pipeline locally by running:
```bash
# Ensure you are inside the backend directory:
npx ts-node src/pipeline.ts
```
