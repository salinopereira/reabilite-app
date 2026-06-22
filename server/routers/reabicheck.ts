import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { reabiCheckins, userGamification } from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const reabiCheckRouter = router({
  // Create check-in
  createCheckin: protectedProcedure
    .input(
      z.object({
        checkinDate: z.string(),
        photoUrl: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const checkinDate = new Date(input.checkinDate);

      await db.insert(reabiCheckins).values({
        userId: ctx.user.id,
        checkinDate: checkinDate,
        checkinTime: new Date(),
        photoUrl: input.photoUrl,
        notes: input.notes,
      });

      // Update gamification points
      const gamification = await db
        .select()
        .from(userGamification)
        .where(eq(userGamification.userId, ctx.user.id))
        .limit(1);

      if (gamification.length > 0) {
        await db
          .update(userGamification)
          .set({
            totalPoints: (gamification[0].totalPoints || 0) + 10,
            totalXP: (gamification[0].totalXP || 0) + 5,
            totalWorkouts: (gamification[0].totalWorkouts || 0) + 1,
          })
          .where(eq(userGamification.userId, ctx.user.id));
      }

      return { success: true };
    }),

  // Get check-ins for a date range
  getCheckins: protectedProcedure
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const start = new Date(input.startDate);
      const end = new Date(input.endDate);

      const checkins = await db
        .select()
        .from(reabiCheckins)
        .where(
          and(
            eq(reabiCheckins.userId, ctx.user.id),
            gte(reabiCheckins.checkinDate, start),
            lte(reabiCheckins.checkinDate, end)
          )
        );

      return checkins;
    }),

  // Get current streak
  getCurrentStreak: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const checkins = await db
      .select()
      .from(reabiCheckins)
      .where(eq(reabiCheckins.userId, ctx.user.id));

    if (checkins.length === 0) return { streak: 0, bestStreak: 0 };

    // Sort by date descending
    const sorted = checkins.sort((a, b) => new Date(b.checkinDate).getTime() - new Date(a.checkinDate).getTime());

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i].checkinDate);
      const next = new Date(sorted[i + 1].checkinDate);

      const diffTime = current.getTime() - next.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (Math.abs(diffDays - 1) < 0.5) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    currentStreak = tempStreak;
    bestStreak = Math.max(bestStreak, tempStreak);

    return { streak: currentStreak, bestStreak };
  }),

  // Get total workouts
  getTotalWorkouts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const checkins = await db
      .select()
      .from(reabiCheckins)
      .where(eq(reabiCheckins.userId, ctx.user.id));

    return { total: checkins.length };
  }),
});
