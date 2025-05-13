import fs from 'fs';
import path from 'path';

const INPUT_FILE = path.join(__dirname, '小词汇.txt');
const OUTPUT_FILE = path.join(__dirname, '小词汇.csv');

const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;

function parseMandarinInput(): [string, string][] {
  const raw = fs.readFileSync(INPUT_FILE, 'utf8');
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      /* Match format: ("登录", "log in") */
      // const match = line.match(/^\(["'](.+?)["']\s*,\s*["'](.+?)["']\)$/);
      const match = line.match(/\(["'](.+?)["']\s*,\s*["'](.+?)["']\)/);
      if (!match){
        console.warn('⚠️ Skipped line (no match):', line);
        return null;
      }
      const [, ch, en] = match;
      return [ch.trim(), en.trim()];
    })
    .filter((entry): entry is [string, string] => !!entry);
}

function generateCSV(rows: [string, string][]) {
  const csvLines = [
    'ch,en',
    ...rows.map(([ch, en]) => `${escapeCSV(ch)},${escapeCSV(en)}`)
  ];
  fs.writeFileSync(OUTPUT_FILE, csvLines.join('\n'), 'utf8');
  console.log(`✅ CSV created: ${OUTPUT_FILE} with ${rows.length} entries.`);
}

const rows = parseMandarinInput();
generateCSV(rows);
