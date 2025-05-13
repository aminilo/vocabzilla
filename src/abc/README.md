# Prepare Data

```sh
npx ts-node src/abc/_SyncWordFamilyToWordStash.ts
npx ts-node src/abc/_WordTempCSV.ts
npx ts-node src/abc/_CheckMissingWordsInStash.ts
npx ts-node src/abc/_小词汇CSV.ts
```
## Also for WordFamily run

```sh
npx ts-node src/abc/_FamilyCSV.ts
```

### Start afresh (if need be)

```ts
ALTER SEQUENCE "Cihui_id_seq" RESTART WITH 1;
```

# Populate the DB from PSQL Shell

```sh
\copy "Enword" (word) FROM '~/Documents/vocabzilla/src/abc/word_stash.txt' WITH (FORMAT TEXT);
\copy "Wordfamily" (hanzi) FROM '~/Documents/TST/tmp/汉字表.txt' WITH (FORMAT TEXT);
\copy "Enexp"("wordKey", "exp") FROM '~/Documents/vocabzilla/src/abc/word_temp.csv' DELIMITER ',' CSV HEADER;
\copy "Cihui"("ch", "en") FROM '~/Documents/vocabzilla/src/abc/小词汇.csv' DELIMITER ',' CSV HEADER;
\copy "Hanzi" (hanzi) FROM '~/Documents/TST/tmp/汉字表.txt' WITH (FORMAT TEXT);
```
