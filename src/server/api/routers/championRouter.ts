import { z } from "zod";
import { 
  createTRPCRouter, 
  publicProcedure, 
  protectedProcedure 
} from "@/server/api/trpc";
import { 
  getChampions,
  getChampionById,
  getChampionByKey 
} from "@/lib/championsApi";

export const championRouter = createTRPCRouter({
  getAllChampions: publicProcedure
    .query(async () => {
      const champions = await getChampions();
      return champions;
    }),

  getChampionDetails: publicProcedure
    .input(z.object({
      championId: z.string(),
    }))
    .query(async ({ input }) => {
      const champion = await getChampionById(input.championId);
      return champion;
    }),

  getChampionByKey: publicProcedure
    .input(z.object({
      key: z.string(),
    }))
    .query(async ({ input }) => {
      const champion = await getChampionByKey(input.key);
      return champion;
    }),

  toggleFavoriteChampion: protectedProcedure
    .input(z.object({
      championId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.favoriteChampion.findUnique({
        where: {
          userId_championId: {
            userId: ctx.session.user.id,
            championId: input.championId,
          },
        },
      });

      if (existing) {
        await ctx.prisma.favoriteChampion.delete({
          where: { id: existing.id },
        });
        return { action: "removed" };
      } else {
        await ctx.prisma.favoriteChampion.create({
          data: {
            userId: ctx.session.user.id,
            championId: input.championId,
          },
        });
        return { action: "added" };
      }
    }),

  getFavoriteChampions: protectedProcedure
    .query(async ({ ctx }) => {
      const favorites = await ctx.prisma.favoriteChampion.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { addedAt: "desc" },
      });
      
      return favorites;
    }),
});