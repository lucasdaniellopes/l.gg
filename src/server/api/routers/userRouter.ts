import { z } from "zod";
import { 
  createTRPCRouter, 
  protectedProcedure 
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          riotAccounts: true,
          _count: {
            select: {
              favoriteChampions: true,
              playerAnalytics: true,
            },
          },
        },
      });
      
      return user;
    }),

  updateUserTier: protectedProcedure
    .input(z.object({
      tier: z.enum(["FREE", "BASIC", "PRO"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { tier: input.tier },
      });
      
      return updatedUser;
    }),

  deleteAccount: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.prisma.user.delete({
        where: { id: ctx.session.user.id },
      });
      
      return { success: true };
    }),
});