/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "icon" TEXT NOT NULL DEFAULT E'🌐';

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");
