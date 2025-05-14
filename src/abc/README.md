# Prepare Data

```sh
npx ts-node src/abc/_SyncWordFamilyToWordStash.ts
npx ts-node src/abc/_WordTempCSV.ts
npx ts-node src/abc/_CheckMissingWordsInStash.ts
npx ts-node src/abc/_小词汇CSV.ts
```
## Also to populate WordFamily run

```sh
npx ts-node src/abc/_FamilyCSV.ts
\copy "WordFamilyMember" ("groupId", "word") FROM '~/Documents/vocabzilla/src/abc/word_family_members.csv' DELIMITER ',' CSV HEADER;
```

### Start afresh (if need be)

```ts
ALTER SEQUENCE "Cihui_id_seq" RESTART WITH 1;
```

# Populate the DB from PSQL Shell

```sh
\copy "Enword" (word) FROM '~/Documents/vocabzilla/src/abc/word_stash.txt' WITH (FORMAT TEXT);
\copy "Enexp"("wordKey", "exp") FROM '~/Documents/vocabzilla/src/abc/_word_temp.csv' DELIMITER ',' CSV HEADER;
\copy "Cihui"("ch", "en") FROM '~/Documents/vocabzilla/src/abc/小词汇.csv' DELIMITER ',' CSV HEADER;
\copy "Hanzi" (hanzi, pinyin, meaning) FROM '~/Documents/vocabzilla/src/abc/汉字表.csv' DELIMITER ',' CSV HEADER;
```
