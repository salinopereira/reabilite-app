import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { userProfiles, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, ctx.user.id))
      .limit(1);

    return profile[0] || null;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string().optional(),
        height: z.string().optional(),
        weight: z.string().optional(),
        objective: z.string().optional(),
        age: z.number().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        observations: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, ctx.user.id))
        .limit(1);

      if (existingProfile.length > 0) {
        await db
          .update(userProfiles)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, ctx.user.id));
      } else {
        await db.insert(userProfiles).values({
          userId: ctx.user.id,
          ...input,
        });
      }

      return { success: true };
    }),

  // List all users (admin only)
  listUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can list users" });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const allUsers = await db.select().from(users);
    return allUsers;
  }),

  // Approve user (admin only)
  approveUser: protectedProcedure
    .input(z.object({ userId: z.number(), approved: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can approve users" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(users)
        .set({
          approvalStatus: input.approved ? "approved" : "rejected",
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId));

      return { success: true };
    }),

  // Get pending users
  getPendingUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view pending users" });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const pendingUsers = await db
      .select()
      .from(users)
      .where(eq(users.approvalStatus, "pending"));

    return pendingUsers;
  }),
});
