import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const CSV_PATH = path.join(__dirname, 'word_family.csv');
const GROUP_CSV = path.join(__dirname, 'word_family_groups.csv');
const MEMBER_CSV = path.join(__dirname, 'word_family_members.csv');

const groups = new Set<string>();
const members: Array<{ label: string; word: string }> = [];

fs.createReadStream(CSV_PATH)
  .pipe(csv({ headers: ['label', 'word'] })) /* Explicitly set headers */
  .on('data', (row) => {
    const label = row.label?.trim();
    const word = row.word?.trim();
    
    if (label && word) {
      groups.add(label);
      members.push({ label, word });
    }
  })
  .on('end', () => {
    /* Write groups CSV */
    fs.writeFileSync(GROUP_CSV, 'label\n' + Array.from(groups).join('\n'));
    
    /* Write members CSV */
    const memberCSVContent = members
      .map(m => `${m.label},${m.word}`)
      .join('\n');
    fs.writeFileSync(MEMBER_CSV, 'label,word\n' + memberCSVContent);

    console.log(`✅ Generated:
- ${groups.size} groups → ${GROUP_CSV}
- ${members.length} members → ${MEMBER_CSV}`);
  })
  .on('error', (err) => {
    console.error('🚨 CSV Error:', err);
    process.exit(1);
  });
