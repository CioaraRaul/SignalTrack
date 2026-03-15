-- CreateTable
CREATE TABLE `vehicles` (
    `id` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(191) NOT NULL,
    `driverName` VARCHAR(191) NOT NULL,
    `status` ENUM('idle', 'moving', 'alert', 'offline') NOT NULL DEFAULT 'idle',
    `speed` DOUBLE NOT NULL DEFAULT 0,
    `fuelLevel` DOUBLE NOT NULL DEFAULT 100,
    `lat` DOUBLE NOT NULL,
    `lng` DOUBLE NOT NULL,
    `lastUpdate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehicles_plateNumber_key`(`plateNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alerts` (
    `id` VARCHAR(191) NOT NULL,
    `vehicleId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `value` DOUBLE NOT NULL,
    `threshold` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `alerts_vehicleId_idx`(`vehicleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alerts` ADD CONSTRAINT `alerts_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
