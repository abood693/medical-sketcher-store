CREATE TABLE `assistantSettings` (
	`key` varchar(32) NOT NULL,
	`value` json NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assistantSettings_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `contentShelves` (
	`id` varchar(16) NOT NULL,
	`title` varchar(80) NOT NULL,
	`contentStatus` enum('coming_soon','published','hidden') NOT NULL DEFAULT 'coming_soon',
	`note` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentShelves_id` PRIMARY KEY(`id`)
);
