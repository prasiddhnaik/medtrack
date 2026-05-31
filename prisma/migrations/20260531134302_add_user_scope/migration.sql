/*
  Warnings:

  - Added the required column `userEmail` to the `DoseLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Medication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoseLog" ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "DoseLog_userEmail_idx" ON "DoseLog"("userEmail");

-- CreateIndex
CREATE INDEX "Medication_userEmail_idx" ON "Medication"("userEmail");
