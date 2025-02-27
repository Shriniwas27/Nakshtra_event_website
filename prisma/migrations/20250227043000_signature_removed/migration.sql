/*
  Warnings:

  - You are about to drop the column `razorpay_signature` on the `Registration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "razorpay_signature";
