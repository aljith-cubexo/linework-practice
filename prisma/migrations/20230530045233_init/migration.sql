/*
  Warnings:

  - The values [SUBACCOUNT] on the enum `Role_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Role` MODIFY `role` ENUM('USER', 'ADMIN', 'SELLER') NOT NULL DEFAULT 'USER';
