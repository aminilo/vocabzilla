import fs from 'fs';
import path from 'path';

const INPUT_FILE = path.join(__dirname, 'word_temp_notebook.txt');
const OUTPUT_FILE = path.join(__dirname, 'word_temp.csv');

const escapeCSV = (str: string) => `"${str.replace(/"/g, '""')}"`;

// const removeBrackets = (text: string) => text.replace(/\[(.+?)\]/g, '$1');

function parseInputFile(): [string, string][] {
  const raw = fs.readFileSync(INPUT_FILE, 'utf8');
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [key, exp] = line.split('##');
      return [key?.trim(), exp?.trim()] as [string, string];
    })
    .filter(([key, exp]) => key && exp); /* Skip incomplete or malformed lines */
}

function generateCSV(rows: [string, string][]) {
  const csvLines = [
    'wordKey,exp',
    ...rows.map(([key, exp]) => `${escapeCSV(key)},${escapeCSV(exp)}`)
  ];
  fs.writeFileSync(OUTPUT_FILE, csvLines.join('\n'));
  console.log(`✅ Generated ${rows.length} rows to CSV: ${OUTPUT_FILE}`);
}

const rows = parseInputFile();
generateCSV(rows);
