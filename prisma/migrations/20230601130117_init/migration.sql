/*
  Warnings:

  - You are about to drop the column `verifiedAt` on the `User` table. All the data in the column will be lost.
  - The `isEmailVerifiedAt` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `verifiedAt`,
    DROP COLUMN `isEmailVerifiedAt`,
    ADD COLUMN `isEmailVerifiedAt` DATETIME(3) NULL;
