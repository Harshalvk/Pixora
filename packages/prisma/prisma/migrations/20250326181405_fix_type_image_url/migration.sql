/*
  Warnings:

  - You are about to drop the column `imgaeUrl` on the `Option` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Option` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "imgaeUrl",
ADD COLUMN     "imageUrl" TEXT NOT NULL;
