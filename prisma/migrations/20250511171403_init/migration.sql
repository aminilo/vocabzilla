-- CreateEnum
CREATE TYPE "ProgressItemType" AS ENUM ('hanzi', 'cihui', 'enexp', 'idiom', 'phv');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('learning', 'review', 'mastered', 'partial');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hanzi" (
    "id" SERIAL NOT NULL,
    "hanzi" TEXT NOT NULL,
    "pinyin" TEXT,
    "meaning" TEXT,

    CONSTRAINT "Hanzi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cihui" (
    "id" SERIAL NOT NULL,
    "ch" TEXT NOT NULL,
    "en" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Cihui_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CihuiHanzi" (
    "hanziId" INTEGER NOT NULL,
    "cihuiId" INTEGER NOT NULL,

    CONSTRAINT "CihuiHanzi_pkey" PRIMARY KEY ("hanziId","cihuiId")
);

-- CreateTable
CREATE TABLE "Enword" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "Enword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enexp" (
    "id" SERIAL NOT NULL,
    "exp" TEXT NOT NULL,
    "wordKey" TEXT NOT NULL,

    CONSTRAINT "Enexp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordFamilyGroup" (
    "id" SERIAL NOT NULL,
    "label" TEXT,

    CONSTRAINT "WordFamilyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordFamilyMember" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "word" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "WordFamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemType" "ProgressItemType" NOT NULL,
    "itemId" INTEGER NOT NULL,
    "status" "ProgressStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hanzi_hanzi_key" ON "Hanzi"("hanzi");

-- CreateIndex
CREATE UNIQUE INDEX "Cihui_ch_key" ON "Cihui"("ch");

-- CreateIndex
CREATE UNIQUE INDEX "Enword_word_key" ON "Enword"("word");

-- CreateIndex
CREATE UNIQUE INDEX "WordFamilyMember_groupId_word_key" ON "WordFamilyMember"("groupId", "word");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_itemType_itemId_key" ON "UserProgress"("userId", "itemType", "itemId");

-- AddForeignKey
ALTER TABLE "CihuiHanzi" ADD CONSTRAINT "CihuiHanzi_hanziId_fkey" FOREIGN KEY ("hanziId") REFERENCES "Hanzi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CihuiHanzi" ADD CONSTRAINT "CihuiHanzi_cihuiId_fkey" FOREIGN KEY ("cihuiId") REFERENCES "Cihui"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enexp" ADD CONSTRAINT "Enexp_wordKey_fkey" FOREIGN KEY ("wordKey") REFERENCES "Enword"("word") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordFamilyMember" ADD CONSTRAINT "WordFamilyMember_word_fkey" FOREIGN KEY ("word") REFERENCES "Enword"("word") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordFamilyMember" ADD CONSTRAINT "WordFamilyMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "WordFamilyGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
