CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeName` text NOT NULL,
	`badgeType` enum('7workouts','30workouts','50workouts','100workouts','200workouts','500workouts','special') NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `body_evolution` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recordDate` date NOT NULL,
	`weight` decimal(5,2),
	`imc` decimal(5,2),
	`bodyFatPercentage` decimal(5,2),
	`muscleMass` decimal(5,2),
	`waistCircumference` decimal(5,2),
	`chestCircumference` decimal(5,2),
	`armCircumference` decimal(5,2),
	`photoUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `body_evolution_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `challenge_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengeId` int NOT NULL,
	`userId` int NOT NULL,
	`progress` int DEFAULT 0,
	`completed` boolean DEFAULT false,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `challenge_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengeName` text NOT NULL,
	`challengeType` enum('21days','30days','weightloss','hypertrophy','steps','team') NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_habits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`habitDate` date NOT NULL,
	`waterIntake` int,
	`sleepHours` decimal(3,1),
	`mood` int,
	`energy` int,
	`muscleSoreness` int,
	`steps` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mental_health_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recordDate` date NOT NULL,
	`mood` int,
	`anxiety` int,
	`stress` int,
	`sleepQuality` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mental_health_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionType` enum('daily','weekly','monthly') NOT NULL,
	`missionName` text NOT NULL,
	`target` int,
	`progress` int DEFAULT 0,
	`completed` boolean DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `missions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nutrition_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`recordDate` date NOT NULL,
	`mealType` enum('breakfast','lunch','snack','dinner') NOT NULL,
	`description` text,
	`photoUrl` text,
	`waterIntake` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nutrition_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reabi_checkins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`checkinDate` date NOT NULL,
	`checkinTime` timestamp NOT NULL DEFAULT (now()),
	`photoUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reabi_checkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`content` text,
	`postType` enum('checkin','achievement','progress','general') NOT NULL,
	`likes` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_gamification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalPoints` int DEFAULT 0,
	`totalXP` int DEFAULT 0,
	`currentLevel` int DEFAULT 1,
	`currentStreak` int DEFAULT 0,
	`bestStreak` int DEFAULT 0,
	`totalWorkouts` int DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_gamification_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_gamification_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`photoUrl` text,
	`height` decimal(5,2),
	`weight` decimal(5,2),
	`objective` text,
	`startDate` date,
	`age` int,
	`gender` enum('male','female','other'),
	`observations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`professionalId` int,
	`workoutDate` date NOT NULL,
	`exerciseName` text NOT NULL,
	`series` int,
	`repetitions` int,
	`weight` decimal(5,2),
	`restTime` int,
	`videoUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','patient','professional') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `userType` enum('patient','professional','admin') NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `approvalStatus` enum('pending','approved','rejected') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `whatsappNotified` boolean DEFAULT false;