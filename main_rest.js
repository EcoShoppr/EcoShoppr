const fetch = require('node-fetch');
const { spawn } = require('child_process');
const path = require('path');

const accountId = process.env.ACCOUNT_ID || '60c402aea1885a31bd9e895797abdc96';
const databaseId = process.env.GROCERIES_ID || '17d387e1-2a15-4a03-9ce6-3edf5fa90887';
const apiToken = process.env.CLOUDFLARE_API_TOKEN; // Must be set in your environment

async function executeSQL(sql) {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql })
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`REST API Error: ${errText}`);
  }
  const data = await response.json();
  return data;
}

async function clearDatabase() {
  console.log("Clearing D1 database...");
  const dropSql = "DROP TABLE IF EXISTS dozen_egg_options;";
  await executeSQL(dropSql);
  console.log("Table 'dozen_egg_options' dropped.");
}

function runScraper(scraperRelativePath) {
  return new Promise((resolve, reject) => {
    const scraperPath = path.join(__dirname, scraperRelativePath);
    console.log(`Running scraper: ${scraperRelativePath}`);
    const child = spawn('python', [scraperPath], { stdio: ['ignore','pipe','pipe'] });
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    child.stderr.on('data', (data) => {
      console.error(`Error from ${scraperRelativePath}: ${data.toString()}`);
    });
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Scraper ${scraperRelativePath} exited with code ${code}`));
      } else {
        try {
          const records = JSON.parse(output);
          resolve(records);
        } catch (err) {
          reject(new Error(`Error parsing output from ${scraperRelativePath}: ${err}`));
        }
      }
    });
  });
}

async function insertRecords(records, groceryStore) {
  const foodType = "dozen_egg_options";
  for (const record of records) {
    // Sanitize values for SQL insertion.
    const item = record.option.replace(/'/g, "''");
    const price = record.price.replace(/'/g, "''");
    const insertSql = `
      INSERT INTO dozen_egg_options (food_type, grocery_store, item, price, time)
      VALUES ('${foodType}', '${groceryStore}', '${item}', '${price}', '');
    `;
    await executeSQL(insertSql);
  }
}

async function main() {
  try {
    await clearDatabase();

    const scrapers = [
      { path: "backend/nob_hill_scraper/nob_hill_scraper.py", grocery: "nob_hill" },
      { path: "backend/safeway_scraper/safeway_scraper.py", grocery: "safeway" },
      { path: "backend/staff_of_life_scraper/staff_of_life_scraper.py", grocery: "staff_of_life" }
    ];

    for (const scraper of scrapers) {
      const records = await runScraper(scraper.path);
      await insertRecords(records, scraper.grocery);
      console.log(`Inserted records from ${scraper.path} for ${scraper.grocery}.`);
    }
    console.log("All scrapers have completed and the D1 database is populated.");
  } catch (err) {
    console.error("Error in main_rest.js:", err);
  }
}

main();
