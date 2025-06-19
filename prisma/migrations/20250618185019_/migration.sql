/*
  Warnings:

  - The values [TEXT,MULTIPLE_CHOICE,CHECKBOX,RADIO,SCALE] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `options` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `required` on the `SurveyQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `surveySubmitted` on the `User` table. All the data in the column will be lost.
  - Made the column `description` on table `Survey` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('short_text', 'long_text', 'number', 'date');
ALTER TABLE "SurveyQuestion" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "Survey" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "SurveyQuestion" DROP COLUMN "options",
DROP COLUMN "order",
DROP COLUMN "question",
DROP COLUMN "required",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleId",
DROP COLUMN "surveySubmitted";
