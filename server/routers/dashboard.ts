import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { reabiCheckins, userGamification, bodyEvolution, dailyHabits, missions } from "../../drizzle/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const dashboardRouter = router({
  // Get unified dashboard data
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get gamification data
    const gamification = await db
      .select()
      .from(userGamification)
      .where(eq(userGamification.userId, ctx.user.id))
      .limit(1);

    // Get check-ins this month
    const monthlyCheckins = await db
      .select()
      .from(reabiCheckins)
      .where(
        and(
          eq(reabiCheckins.userId, ctx.user.id),
          gte(reabiCheckins.checkinDate, startOfMonth),
          lte(reabiCheckins.checkinDate, now)
        )
      );

    // Get check-ins this week
    const weeklyCheckins = await db
      .select()
      .from(reabiCheckins)
      .where(
        and(
          eq(reabiCheckins.userId, ctx.user.id),
          gte(reabiCheckins.checkinDate, sevenDaysAgo),
          lte(reabiCheckins.checkinDate, now)
        )
      );

    // Get latest body evolution
    const latestBodyEvolution = await db
      .select()
      .from(bodyEvolution)
      .where(eq(bodyEvolution.userId, ctx.user.id))
      .orderBy(desc(bodyEvolution.recordDate))
      .limit(1);

    // Get daily habits this week
    const weeklyHabits = await db
      .select()
      .from(dailyHabits)
      .where(
        and(
          eq(dailyHabits.userId, ctx.user.id),
          gte(dailyHabits.habitDate, sevenDaysAgo),
          lte(dailyHabits.habitDate, now)
        )
      );

    // Get active missions
    const activeMissions = await db
      .select()
      .from(missions)
      .where(
        and(
          eq(missions.userId, ctx.user.id),
          eq(missions.completed, false)
        )
      );

    return {
      gamification: gamification[0] || null,
      monthlyWorkouts: monthlyCheckins.length,
      weeklyWorkouts: weeklyCheckins.length,
      totalWorkouts: gamification[0]?.totalWorkouts || 0,
      currentStreak: gamification[0]?.currentStreak || 0,
      bestStreak: gamification[0]?.bestStreak || 0,
      bodyEvolution: latestBodyEvolution[0] || null,
      weeklyHabits,
      activeMissions,
    };
  }),

  // Get evolution chart data (last 30 days)
  getEvolutionChart: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const thirtyDaysAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);

    const evolution = await db
      .select()
      .from(bodyEvolution)
      .where(
        and(
          eq(bodyEvolution.userId, ctx.user.id),
          gte(bodyEvolution.recordDate, thirtyDaysAgo)
        )
      )
      .orderBy(bodyEvolution.recordDate);

    return evolution.map((e) => ({
      date: e.recordDate,
      weight: e.weight,
      imc: e.imc,
    }));
  }),

  // Get quality of life score (0-100)
  getQualityOfLifeScore: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get weekly data
    const weeklyCheckins = await db
      .select()
      .from(reabiCheckins)
      .where(
        and(
          eq(reabiCheckins.userId, ctx.user.id),
          gte(reabiCheckins.checkinDate, sevenDaysAgo)
        )
      );

    const weeklyHabits = await db
      .select()
      .from(dailyHabits)
      .where(
        and(
          eq(dailyHabits.userId, ctx.user.id),
          gte(dailyHabits.habitDate, sevenDaysAgo)
        )
      );

    // Calculate score based on multiple factors
    let score = 0;

    // Workouts (max 30 points)
    score += Math.min(weeklyCheckins.length * 5, 30);

    // Sleep quality (max 20 points)
    const avgSleep = weeklyHabits.length > 0
      ? weeklyHabits.reduce((acc, h) => acc + (h.sleepHours ? parseFloat(h.sleepHours.toString()) : 0), 0) / weeklyHabits.length
      : 0;
    score += Math.min(avgSleep * 2.5, 20);

    // Mood (max 20 points)
    const avgMood = weeklyHabits.length > 0
      ? weeklyHabits.reduce((acc, h) => acc + (h.mood || 0), 0) / weeklyHabits.length
      : 0;
    score += Math.min((avgMood / 10) * 20, 20);

    // Water intake (max 15 points)
    const avgWater = weeklyHabits.length > 0
      ? weeklyHabits.reduce((acc, h) => acc + (h.waterIntake || 0), 0) / weeklyHabits.length
      : 0;
    score += Math.min((avgWater / 8) * 15, 15);

    // Energy (max 15 points)
    const avgEnergy = weeklyHabits.length > 0
      ? weeklyHabits.reduce((acc, h) => acc + (h.energy || 0), 0) / weeklyHabits.length
      : 0;
    score += Math.min((avgEnergy / 10) * 15, 15);

    return Math.round(score);
  }),
});
