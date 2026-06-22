CREATE TABLE `users` (
    `id` int AUTO_INCREMENT NOT NULL,
    `openId` varchar(64) NOT NULL,
    `name` text,
    `email` varchar(320),
    `loginMethod` varchar(64),
    `role` enum('user','admin') NOT NULL DEFAULT 'user',
    `createdAt` datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `lastSignedIn` datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
    CONSTRAINT `users_id` PRIMARY KEY(`id`),
    CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);