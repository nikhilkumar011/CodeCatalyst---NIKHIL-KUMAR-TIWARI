/*
  Warnings:

  - Added the required column `userId` to the `UploadedFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UploadedFile" ADD COLUMN     "userId" TEXT NOT NULL;
