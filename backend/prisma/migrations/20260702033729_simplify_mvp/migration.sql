/*
  Warnings:

  - You are about to drop the column `accessesInternals` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `computedCoupling` on the `connection` table. All the data in the column will be lost.
  - You are about to drop the column `accessesGlobalData` on the `module` table. All the data in the column will be lost.
  - You are about to drop the column `isExternalIO` on the `module` table. All the data in the column will be lost.
  - You are about to drop the `dataitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `dataitem` DROP FOREIGN KEY `DataItem_connectionId_fkey`;

-- AlterTable
ALTER TABLE `connection` DROP COLUMN `accessesInternals`,
    DROP COLUMN `computedCoupling`;

-- AlterTable
ALTER TABLE `module` DROP COLUMN `accessesGlobalData`,
    DROP COLUMN `isExternalIO`;

-- DropTable
DROP TABLE `dataitem`;
