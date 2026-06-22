import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  // Admin: list all users
  listAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const result = await db.select({
      id: users.id,
      openId: users.openId,
      name: users.name,
      email: users.email,
      role: users.role,
      userType: users.userType,
      approvalStatus: users.approvalStatus,
      createdAt: users.createdAt,
      lastSignedIn: users.lastSignedIn,
    }).from(users).orderBy(users.createdAt);
    return result;
  }),

  // Admin: approve/reject user
  setApproval: adminProcedure
    .input(z.object({
      userId: z.number(),
      status: z.enum(["approved", "rejected", "pending"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(users).set({ approvalStatus: input.status }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // Admin: set role
  setRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(["user", "admin", "patient", "professional"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),

  // Get own profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    const result = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
    return result[0] ?? null;
  }),
});
