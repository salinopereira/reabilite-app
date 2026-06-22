import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date, boolean, json } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: text("passwordHash"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "patient", "professional"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["patient", "professional", "admin"]).notNull(),
  approvalStatus: mysqlEnum("approvalStatus", ["pending", "approved", "rejected"]).default("pending").notNull(),
  whatsappNotified: boolean("whatsappNotified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  photoUrl: text("photoUrl"),
  height: decimal("height", { precision: 5, scale: 2 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  objective: text("objective"),
  startDate: date("startDate"),
  age: int("age"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  observations: text("observations"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export const reabiCheckins = mysqlTable("reabi_checkins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  checkinDate: date("checkinDate").notNull(),
  checkinTime: timestamp("checkinTime").defaultNow().notNull(),
  photoUrl: text("photoUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReabiCheckin = typeof reabiCheckins.$inferSelect;
export type InsertReabiCheckin = typeof reabiCheckins.$inferInsert;

export const bodyEvolution = mysqlTable("body_evolution", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recordDate: date("recordDate").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  imc: decimal("imc", { precision: 5, scale: 2 }),
  bodyFatPercentage: decimal("bodyFatPercentage", { precision: 5, scale: 2 }),
  muscleMass: decimal("muscleMass", { precision: 5, scale: 2 }),
  waistCircumference: decimal("waistCircumference", { precision: 5, scale: 2 }),
  chestCircumference: decimal("chestCircumference", { precision: 5, scale: 2 }),
  armCircumference: decimal("armCircumference", { precision: 5, scale: 2 }),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BodyEvolution = typeof bodyEvolution.$inferSelect;
export type InsertBodyEvolution = typeof bodyEvolution.$inferInsert;

export const workouts = mysqlTable("workouts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  professionalId: int("professionalId"),
  workoutDate: date("workoutDate").notNull(),
  exerciseName: text("exerciseName").notNull(),
  series: int("series"),
  repetitions: int("repetitions"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  restTime: int("restTime"),
  videoUrl: text("videoUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

export const dailyHabits = mysqlTable("daily_habits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  habitDate: date("habitDate").notNull(),
  waterIntake: int("waterIntake"),
  sleepHours: decimal("sleepHours", { precision: 3, scale: 1 }),
  mood: int("mood"),
  energy: int("energy"),
  muscleSoreness: int("muscleSoreness"),
  steps: int("steps"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyHabit = typeof dailyHabits.$inferSelect;
export type InsertDailyHabit = typeof dailyHabits.$inferInsert;

export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeName: text("badgeName").notNull(),
  badgeType: mysqlEnum("badgeType", ["7workouts", "30workouts", "50workouts", "100workouts", "200workouts", "500workouts", "special"]).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

export const userGamification = mysqlTable("user_gamification", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  totalPoints: int("totalPoints").default(0),
  totalXP: int("totalXP").default(0),
  currentLevel: int("currentLevel").default(1),
  currentStreak: int("currentStreak").default(0),
  bestStreak: int("bestStreak").default(0),
  totalWorkouts: int("totalWorkouts").default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserGamification = typeof userGamification.$inferSelect;
export type InsertUserGamification = typeof userGamification.$inferInsert;

export const socialPosts = mysqlTable("social_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  content: text("content"),
  postType: mysqlEnum("postType", ["checkin", "achievement", "progress", "general"]).notNull(),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;

export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  challengeName: text("challengeName").notNull(),
  challengeType: mysqlEnum("challengeType", ["21days", "30days", "weightloss", "hypertrophy", "steps", "team"]).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;

export const challengeParticipants = mysqlTable("challenge_participants", {
  id: int("id").autoincrement().primaryKey(),
  challengeId: int("challengeId").notNull(),
  userId: int("userId").notNull(),
  progress: int("progress").default(0),
  completed: boolean("completed").default(false),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = typeof challengeParticipants.$inferInsert;

export const nutritionRecords = mysqlTable("nutrition_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recordDate: date("recordDate").notNull(),
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "snack", "dinner"]).notNull(),
  description: text("description"),
  photoUrl: text("photoUrl"),
  waterIntake: int("waterIntake"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NutritionRecord = typeof nutritionRecords.$inferSelect;
export type InsertNutritionRecord = typeof nutritionRecords.$inferInsert;

export const mentalHealthRecords = mysqlTable("mental_health_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  recordDate: date("recordDate").notNull(),
  mood: int("mood"),
  anxiety: int("anxiety"),
  stress: int("stress"),
  sleepQuality: int("sleepQuality"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MentalHealthRecord = typeof mentalHealthRecords.$inferSelect;
export type InsertMentalHealthRecord = typeof mentalHealthRecords.$inferInsert;

export const missions = mysqlTable("missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  missionType: mysqlEnum("missionType", ["daily", "weekly", "monthly"]).notNull(),
  missionName: text("missionName").notNull(),
  target: int("target"),
  progress: int("progress").default(0),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Mission = typeof missions.$inferSelect;
export type InsertMission = typeof missions.$inferInsert;
