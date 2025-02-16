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
      
      const scraperFiles = files.filter(file => file.toLowerCase().includes('scraper') && file.endsWith('.py'));
      if (scraperFiles.length === 0) {
        console.log('No python scraper files found.');
        return resolve();
      }
      
      let completed = 0;
      scraperFiles.forEach(file => {
        const filePath = path.join(scrapersDir, file);
        console.log(`Running scraper: ${file}`);
        const child = spawn('python', [filePath], { stdio: 'inherit' });
        
        child.on('close', (code) => {
          console.log(`Scraper ${file} exited with code ${code}`);
          completed++;
          if (completed === scraperFiles.length) {
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
    // Determine grocery store from relative path (assume first folder is the store)
    const relativePath = path.relative(baseDir, filePath);
    const pathParts = relativePath.split(path.sep);
    const storeName = pathParts.length > 1 ? pathParts[0] : 'default';
    
    const fileName = path.basename(filePath);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch(e) {
      console.error(`Error parsing ${fileName}:`, e);
      return;
    }
    
    // Derive table name from JSON file name (without extension)
    const tableName = path.basename(fileName, '.json');
    
    // Create table with grocery_store column
    sqlStatements += `DROP TABLE IF EXISTS ${tableName};\nCREATE TABLE ${tableName} (\n  grocery_store VARCHAR(255),\n  // ...define columns...\n);\n`;
    
    // Generate INSERT statements including grocery_store value
    if (Array.isArray(data)) {
      data.forEach(row => {
        const columns = Object.keys(row);
        const values = Object.values(row);
        const allColumns = [...columns, 'grocery_store'].join(', ');
        const allValues = [...values.map(val => `'${val}'`), `'${storeName}'`].join(', ');
        sqlStatements += `INSERT INTO ${tableName} (${allColumns}) VALUES (${allValues});\n`;
      });
    } else {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const allColumns = [...columns, 'grocery_store'].join(', ');
      const allValues = [...values.map(val => `'${val}'`), `'${storeName}'`].join(', ');
      sqlStatements += `INSERT INTO ${tableName} (${allColumns}) VALUES (${allValues});\n`;
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
