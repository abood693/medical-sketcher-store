CREATE TABLE `digitalProducts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `title` varchar(180) NOT NULL,
  `description` text NOT NULL,
  `priceCents` int NOT NULL,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `coverUrl` text,
  `pdfKey` varchar(512) NOT NULL,
  `status` enum('draft','published','hidden') NOT NULL DEFAULT 'draft',
  `createdBy` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `digitalProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `digitalOrders` (
  `id` int AUTO_INCREMENT NOT NULL,
  `productId` int NOT NULL,
  `userId` int NOT NULL,
  `paypalOrderId` varchar(80) NOT NULL,
  `status` enum('created','paid','cancelled') NOT NULL DEFAULT 'created',
  `amountCents` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  `paidAt` timestamp,
  CONSTRAINT `digitalOrders_id` PRIMARY KEY(`id`),
  CONSTRAINT `digitalOrders_paypalOrderId_unique` UNIQUE(`paypalOrderId`)
);
--> statement-breakpoint
CREATE TABLE `productLicenses` (
  `id` int AUTO_INCREMENT NOT NULL,
  `productId` int NOT NULL,
  `orderId` int NOT NULL,
  `userId` int NOT NULL,
  `licenseHash` varchar(128) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `productLicenses_id` PRIMARY KEY(`id`),
  CONSTRAINT `productLicenses_orderId_unique` UNIQUE(`orderId`),
  CONSTRAINT `productLicenses_licenseHash_unique` UNIQUE(`licenseHash`)
);
