import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import prisma from '../utils/prismaClient';

type Row = { label: string; word: string };

const CSV_PATH = path.join(__dirname, 'word_family.csv');
const GROUP_CSV = path.join(__dirname, 'word_family_groups.csv');
const MEMBER_CSV = path.join(__dirname, 'word_family_members.csv');

async function main() {
  // Phase 1: Collect all data from CSV
  const labelMap = new Map<string, string[]>();
  
  await new Promise<void>((resolve) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv({ headers: ['label', 'word'] }))
      .on('data', (row: Row) => {
        const label = row.label.trim();
        const word = row.word.trim();
        if (label && word) {
          labelMap.set(label, [...(labelMap.get(label) || []), word]);
        }
      })
      .on('end', () => resolve());
  });

  // Phase 2: Bulk create groups
  const labels = Array.from(labelMap.keys());
  await prisma.$transaction([
    prisma.wordFamilyGroup.createMany({
      data: labels.map(label => ({ label })),
      skipDuplicates: true,
    })
  ]);

  // Phase 3: Get group IDs
  const groups = await prisma.wordFamilyGroup.findMany({
    where: { label: { in: labels } }
  });
  const groupIdMap = new Map(groups.map(g => [g.label, g.id]));

  // Phase 4: Generate CSVs
  // Generate groups CSV (for reference)
  fs.writeFileSync(GROUP_CSV, 'id,label\n' + 
    groups.map(g => `${g.id},${g.label}`).join('\n'));

  // Generate members CSV
  const memberRows = Array.from(labelMap.entries())
    .flatMap(([label, words]) => 
      words.map(word => `${groupIdMap.get(label)},${word}`)
    );
  
  fs.writeFileSync(MEMBER_CSV, 'groupId,word\n' + memberRows.join('\n'));

  console.log(`✅ Generated:
- Groups: ${groups.length} (${GROUP_CSV})
- Members: ${memberRows.length} (${MEMBER_CSV})`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
