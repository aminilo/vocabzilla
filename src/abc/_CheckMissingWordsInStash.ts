import fs from 'fs';
import path from 'path';

const sentenceFile = path.join(__dirname, 'word_temp_notebook.txt');
const wordStashFile = path.join(__dirname, 'word_stash.txt');

const sentenceLines = fs.readFileSync(sentenceFile, 'utf-8')
  .split('\n')
  .map(line => line.split('##')[0].trim())
  .filter(Boolean);

const wordStashWords = new Set(
  fs.readFileSync(wordStashFile, 'utf-8')
    .split('\n')
    .map(w => w.trim())
    .filter(Boolean)
);

const missingWords = [...new Set(sentenceLines)].filter(word => !wordStashWords.has(word));

if (missingWords.length > 0) {
  console.log(`✅ ${missingWords.length} new word(s) do not exist in "word_stash.txt": ${missingWords.join(', ')}`);
} else {
  console.log('✅ All words in sentence file already exist in "word_stash.txt"');
}
