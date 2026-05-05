CREATE TABLE `investments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`amountInvested` int NOT NULL,
	`currentValue` int NOT NULL,
	`externalId` varchar(255),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('deposit','withdraw','investment_buy','investment_sell') NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userFinancialInfo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`totalInvested` int NOT NULL DEFAULT 0,
	`totalGain` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userFinancialInfo_id` PRIMARY KEY(`id`),
	CONSTRAINT `userFinancialInfo_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `userFinancialInfo_cpf_unique` UNIQUE(`cpf`)
);
--> statement-breakpoint
ALTER TABLE `investments` ADD CONSTRAINT `investments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userFinancialInfo` ADD CONSTRAINT `userFinancialInfo_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;