-- CreateTable
CREATE TABLE `DataItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `connectionId` INTEGER NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `dataType` VARCHAR(100) NOT NULL,
    `nature` ENUM('ELEMENTARY', 'STRUCTURE', 'CONTROL_FLAG') NOT NULL,

    INDEX `DataItem_connectionId_idx`(`connectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataItem` ADD CONSTRAINT `DataItem_connectionId_fkey` FOREIGN KEY (`connectionId`) REFERENCES `Connection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
