/*
  Warnings:

  - You are about to drop the column `PaymentId` on the `Registration` table. All the data in the column will be lost.
  - Added the required column `payment_status` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "PaymentId",
ADD COLUMN     "payment_status" TEXT NOT NULL;
