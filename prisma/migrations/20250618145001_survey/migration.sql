/*
  Warnings:

  - You are about to drop the column `answers` on the `SurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SurveyResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,questionId]` on the table `SurveyResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `answer` to the `SurveyResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `SurveyResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyId` to the `SurveyResponse` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX', 'RADIO', 'SCALE');

-- AlterTable
ALTER TABLE "SurveyResponse" DROP COLUMN "answers",
DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "answer" TEXT NOT NULL,
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD COLUMN     "surveyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Survey" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "surveyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyResponse_userId_questionId_key" ON "SurveyResponse"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SurveyQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
