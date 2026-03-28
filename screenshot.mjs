import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const url = process.argv[2];
const label = process.argv[3] || '';
if (!url) { console.error('Usage: node screenshot.mjs <url> [label]'); process.exit(1); }

const dir = './temporary screenshots';
mkdirSync(dir, { recursive: true });

const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-')).length;
const n = existing + 1;
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
const scrollY = parseInt(process.argv[4] || '0', 10);
if (scrollY) await page.evaluate(y => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: join(dir, filename), fullPage: false });
await browser.close();
console.log(`Saved: ${join(dir, filename)}`);
