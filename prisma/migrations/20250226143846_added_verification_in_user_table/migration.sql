-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isverified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationtoken" TEXT;
