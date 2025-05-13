/*
  Warnings:

  - You are about to drop the `CihuiHanzi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CihuiHanzi" DROP CONSTRAINT "CihuiHanzi_cihuiId_fkey";

-- DropForeignKey
ALTER TABLE "CihuiHanzi" DROP CONSTRAINT "CihuiHanzi_hanziId_fkey";

-- DropTable
DROP TABLE "CihuiHanzi";
