import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

const FAMILY_CSV_PATH = path.resolve(__dirname, 'word_family.csv');
const WORDSTASH_PATH = path.resolve(__dirname, 'word_stash.txt');

async function readExistingWords(): Promise<Set<string>> {
  const content = await fs.promises.readFile(WORDSTASH_PATH, 'utf8');
  const words = content.split('\n').map(w => w.trim()).filter(Boolean);
  return new Set(words);
}

async function readFamilyWordsFromCSV(): Promise<Set<string>> {
  return new Promise((resolve, reject) => {
    const words = new Set<string>();
    fs.createReadStream(FAMILY_CSV_PATH)
      .pipe(csvParser())
      .on('data', (row) => {
        if (row.word) {
          words.add(row.word.trim().toLowerCase());
        }
      })
      .on('end', () => resolve(words))
      .on('error', reject);
  });
}

async function appendNewWords(newWords: string[]) {
  const formatted = '\n' + newWords.join('\n') + '\n';
  await fs.promises.appendFile(WORDSTASH_PATH, formatted, 'utf8');
}

async function sync() {
  try {
    const existingWords = await readExistingWords();
    const familyWords = await readFamilyWordsFromCSV();

    const newWords = Array.from(familyWords).filter(word => !existingWords.has(word));
    if (newWords.length === 0) {
      console.log('✅ Synced 0 new words.');
      return;
    }

    await appendNewWords(newWords);
    console.log(`✅ Synced ${newWords.length} new word(s):`, newWords.join(', '));
  } catch (err) {
    console.error('❌ Error during sync:', err);
  }
}

sync();
