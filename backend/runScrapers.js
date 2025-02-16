const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const scrapersDir = __dirname;

fs.readdir(scrapersDir, (err, files) => {
	if (err) {
		console.error('Error reading directory:', err);
		process.exit(1);
	}

	// Filter .js files with "scraper" in the name, excluding this file.
	const scraperFiles = files.filter(file => 
		file.endsWith('.js') && 
		file !== 'runScrapers.js' && 
		file.toLowerCase().includes('scraper')
	);

	if (scraperFiles.length === 0) {
		console.log('No scraper files found.');
		return;
	}

	scraperFiles.forEach(file => {
		const filePath = path.join(scrapersDir, file);
		console.log(`Running scraper: ${file}`);
		const child = spawn('node', [filePath], { stdio: 'inherit' });

		child.on('close', (code) => {
			console.log(`Scraper ${file} exited with code ${code}`);
		});
	});
});
