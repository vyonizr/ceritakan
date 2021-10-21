/*
  Warnings:

  - A unique constraint covering the columns `[submission_id]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('ANONYMOUS', 'IDENTIFIED');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "submission_id" INTEGER;

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "sender_name" TEXT,
    "sender_social_url" TEXT,
    "sender_type" "SenderType" NOT NULL DEFAULT E'ANONYMOUS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_id" INTEGER,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_submission_id_key" ON "Question"("submission_id");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
