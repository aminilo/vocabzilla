import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import prisma from '../utils/prismaClient';

type Row = {
  label: string;
  word: string;
  type: string;
};

const csvFilePath = path.join(__dirname, 'word_family.csv');

const rows: Row[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row: any) => {
    rows.push({
      label: row.label.trim(),
      word: row.word.trim(),
      type: row.type.trim()
    });
  })
  .on('end', async () => {
    console.log(`📦 Loaded ${rows.length} rows...`);

    // Group by label
    const grouped: Record<string, Row[]> = {};
    for (const row of rows) {
      if (!grouped[row.label]) grouped[row.label] = [];
      grouped[row.label].push(row);
    }

    for (const label of Object.keys(grouped)) {
      const members = grouped[label];

      // Check if group already exists
      let group = await prisma.wordFamilyGroup.findFirst({ where: { label } });
      if (!group) {
        group = await prisma.wordFamilyGroup.create({ data: { label } });
        console.log(`✅ Created group: ${label}`);
      } else {
        console.log(`ℹ️ Group "${label}" already exists`);
      }

      let count = 0;

      for (const { word, type } of members) {
        try {
          await prisma.wordFamilyMember.upsert({
            where: {
              groupId_word: {
                groupId: group.id,
                word
              }
            },
            update: { type },
            create: {
              word,
              type,
              groupId: group.id
            }
          });
          count++;
        } catch (err) {
          console.error(`❌ Failed to insert: ${word} in group "${label}"`, err);
        }
      }

      console.log(`✅ Synced ${count} word(s) to group "${label}"`);
    }

    process.exit(0);
  });
