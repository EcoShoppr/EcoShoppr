const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const scrapersDir = __dirname;
const outputSQLFile = path.join(scrapersDir, 'results.sql');

// Run all python scraper files
function runScrapers() {
  return new Promise((resolve, reject) => {
    fs.readdir(scrapersDir, (err, files) => {
      if (err) {
        return reject(err);
      }
      
      // Explicitly define scraper file names instead of filtering
      const existingScrapers = ["nob_hill_scraper/nob_hill_scraper.py", "safeway_scraper/safeway_scraper.py", "staff_of_life_scraper/staff_of_life_scraper.py"];
      
      // Optionally verify that the files exist in the directory
    //   const existingScrapers = scraperFiles.filter(file => files.includes(file));
      
      if (existingScrapers.length === 0) {
        console.log('No python scraper files found.');
        return resolve();
      }
      
      let completed = 0;
      existingScrapers.forEach(file => {
        const filePath = path.join(scrapersDir, file);
        console.log(`Running scraper: ${file}`);
        const child = spawn('python', [filePath], { stdio: 'inherit' });
        
        child.on('close', (code) => {
          console.log(`Scraper ${file} exited with code ${code}`);
          completed++;
          if (completed === existingScrapers.length) {
            resolve();
          }
        });
      });
    });
  });
}

// Recursively find JSON files
function getJSONFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getJSONFiles(filePath));
    } else if (file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

// Aggregate JSON data into a single SQL file
function aggregateJSONToSQL() {
  const baseDir = scrapersDir; // starting folder for search
  let sqlStatements = '';
  const jsonFiles = getJSONFiles(baseDir);
  
  if (jsonFiles.length === 0) {
    console.log('No JSON files found for aggregation.');
    return;
  }
  
  jsonFiles.forEach(filePath => {
    const relativePath = path.relative(baseDir, filePath);
    const pathParts = relativePath.split(path.sep);
    let storeName = pathParts.length > 1 ? pathParts[0] : 'default';
    // Remove undesired suffix if present
    storeName = storeName.replace('_scraper', '');
    
    const fileName = path.basename(filePath);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch(e) {
      console.error(`Error parsing ${fileName}:`, e);
      return;
    }
    
    // Use the file name (without extension) as food_type
    const tableName = path.basename(fileName, '.json');
    
    // Create table with fixed columns: food_type, grocery_store, item, price, time
    sqlStatements += `DROP TABLE IF EXISTS ${tableName};\nCREATE TABLE ${tableName} (\n  food_type VARCHAR(255),\n  grocery_store VARCHAR(255),\n  item VARCHAR(255),\n  price VARCHAR(255),\n  time VARCHAR(255)\n);\n`;
    
    // Generate INSERT statements using fixed columns (with time left blank)
    if (Array.isArray(data)) {
      data.forEach(row => {
        sqlStatements += `INSERT INTO ${tableName} (food_type, grocery_store, item, price, time) VALUES ('${tableName}', '${storeName}', '${row.item || ''}', '${row.price || ''}', '');\n`;
      });
    } else {
      sqlStatements += `INSERT INTO ${tableName} (food_type, grocery_store, item, price, time) VALUES ('${tableName}', '${storeName}', '${data.item || ''}', '${data.price || ''}', '');\n`;
    }
  });
  
  fs.writeFile(outputSQLFile, sqlStatements, err => {
    if (err) {
      console.error('Error writing SQL file:', err);
    } else {
      console.log('SQL file created at:', outputSQLFile);
    }
  });
}

// Main execution: run scrapers then aggregate JSON data into SQL
async function main() {
  try {
    await runScrapers();
    aggregateJSONToSQL();
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
