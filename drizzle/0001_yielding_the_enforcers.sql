CREATE TABLE `quizAttempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`courseLevel` enum('A1/A2','B1/B2','C1/C2') NOT NULL,
	`score` int NOT NULL,
	`total` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizAttempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizQuestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseLevel` enum('A1/A2','B1/B2','C1/C2') NOT NULL,
	`prompt` text NOT NULL,
	`choices` json NOT NULL,
	`correctIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quizQuestions_id` PRIMARY KEY(`id`)
);
