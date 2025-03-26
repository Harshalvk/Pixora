/*
  Warnings:

  - You are about to drop the column `optionId` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "optionId";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "title" DROP NOT NULL;
