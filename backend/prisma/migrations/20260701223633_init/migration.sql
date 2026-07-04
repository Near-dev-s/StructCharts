-- CreateTable
CREATE TABLE `Project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Module` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `type` ENUM('CONTROL', 'SUBORDINATE') NOT NULL,
    `description` TEXT NULL,
    `posX` DOUBLE NOT NULL DEFAULT 0,
    `posY` DOUBLE NOT NULL DEFAULT 0,
    `accessesGlobalData` BOOLEAN NOT NULL DEFAULT false,
    `isExternalIO` BOOLEAN NOT NULL DEFAULT false,

    INDEX `Module_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Connection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromModuleId` INTEGER NOT NULL,
    `toModuleId` INTEGER NOT NULL,
    `relationType` VARCHAR(50) NOT NULL DEFAULT 'CALL',
    `accessesInternals` BOOLEAN NOT NULL DEFAULT false,
    `computedCoupling` ENUM('DATA', 'STAMP', 'CONTROL', 'EXTERNAL', 'COMMON', 'CONTENT') NULL,

    INDEX `Connection_fromModuleId_idx`(`fromModuleId`),
    INDEX `Connection_toModuleId_idx`(`toModuleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Module` ADD CONSTRAINT `Module_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Connection` ADD CONSTRAINT `Connection_fromModuleId_fkey` FOREIGN KEY (`fromModuleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Connection` ADD CONSTRAINT `Connection_toModuleId_fkey` FOREIGN KEY (`toModuleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataItem` ADD CONSTRAINT `DataItem_connectionId_fkey` FOREIGN KEY (`connectionId`) REFERENCES `Connection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
