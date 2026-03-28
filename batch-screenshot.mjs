import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join } from 'path';

const pages = JSON.parse(process.argv[2]);
const outDir = process.argv[3];

mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const { url, name } of pages) {
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise(r => setTimeout(r, 3000));
        const filepath = join(outDir, `${name}.png`);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`OK: ${name}`);
        await page.close();
    } catch (e) {
        console.log(`FAIL: ${name} — ${e.message}`);
    }
}

await browser.close();
console.log('Done');
