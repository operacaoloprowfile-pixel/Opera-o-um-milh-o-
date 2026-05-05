ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` text;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_cpf_unique` UNIQUE(`cpf`);