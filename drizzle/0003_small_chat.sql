CREATE TABLE `lessonFeedback` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonKey` varchar(80) NOT NULL,
	`userId` int,
	`authorName` varchar(100) NOT NULL,
	`rating` int NOT NULL,
	`body` text NOT NULL,
	`feedbackStatus` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessonFeedback_id` PRIMARY KEY(`id`)
);
