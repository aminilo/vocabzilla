import prisma from '../src/utils/prismaClient';

(()=> {
	/* Hanzi Characters */
	await prisma.hanzi.deleteMany(); /* To start afresh, eh? */
	await prisma.hanzi.createMany({
		data: [
			{ hanzi: '一' },
			{ hanzi: '一' },
			{ hanzi: '一' },
		]
	});
	model Hanzi {
	  id      Int          @id @default(autoincrement())
	  hanzi   String       @unique
	  pinyin  String?
	  meaning String?
	}
	/* Mandarin Vocabulary */
	model Cihui {
	  id    Int          @id @default(autoincrement())
	  ch    String       @unique
	  en    String
	  level Int          @default(0)
	}
	/* English Words */
	model Enword {
	  id                Int                @id @default(autoincrement())
	  word              String             @unique
	  examples          Enexp[]
	  wordFamilyMembers WordFamilyMember[]
	}
	/* English Examples */
	model Enexp {
	  id      Int    @id @default(autoincrement())
	  exp     String
	  wordKey String
	  enword  Enword @relation(fields: [wordKey], references: [word], onDelete: Cascade)
	}
	/* WordFamily Groups*/
	model WordFamilyGroup {
	  id    Int                @id @default(autoincrement())
	  label String?
	  words WordFamilyMember[]
	}
	/* WordFamily Members */
	model WordFamilyMember {
	  id      Int             @id @default(autoincrement())
	  type    String?
	  word    String
	  enword  Enword?         @relation(fields: [word], references: [word], onDelete: Cascade)
	  groupId Int
	  group   WordFamilyGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)

	  @@unique([groupId, word])
	}
})().catch(err=> {
	console.error(err);
	process.exit(1);
}).finally(async ()=> await prisma.$disconnect());
