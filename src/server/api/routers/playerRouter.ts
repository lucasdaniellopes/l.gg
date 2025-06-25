import { z } from "zod";
import { 
  createTRPCRouter, 
  publicProcedure, 
  protectedProcedure,
  premiumProcedure 
} from "@/server/api/trpc";
import { 
  getSummonerByName, 
  getAccountByRiotId,
  getSummonerByPuuid,
  getRankedInfoByPuuid,
  getMatchHistory,
  getMatchDetails 
} from "@/lib/riotServerApi";
import { TRPCError } from "@trpc/server";

export const playerRouter = createTRPCRouter({
  getPlayerProfile: publicProcedure
    .input(z.object({
      summonerName: z.string().min(1),
    }))
    .query(async ({ input }) => {
      try {
        let summoner;
        
        if (input.summonerName.includes('#')) {
          const [gameName, tagLine] = input.summonerName.split('#');
          const account = await getAccountByRiotId(gameName, tagLine);
          summoner = await getSummonerByPuuid(account.puuid, account.gameName);
        } else {
          summoner = await getSummonerByName(input.summonerName);
        }
        
        const rankedInfo = await getRankedInfoByPuuid(summoner.puuid);
        
        return {
          summoner,
          rankedInfo,
        };
      } catch {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        });
      }
    }),

  getMatchHistory: publicProcedure
    .input(z.object({
      puuid: z.string(),
      count: z.number().min(1).max(20).default(10),
      start: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const matchIds = await getMatchHistory(input.puuid, input.count, input.start);
      const matches = await Promise.all(
        matchIds.map(id => getMatchDetails(id))
      );
      
      return matches;
    }),

  linkRiotAccount: protectedProcedure
    .input(z.object({
      gameName: z.string(),
      tagLine: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const account = await getAccountByRiotId(input.gameName, input.tagLine);
      const summoner = await getSummonerByPuuid(account.puuid, account.gameName);
      
      const riotAccount = await ctx.prisma.riotAccount.create({
        data: {
          userId: ctx.session.user.id,
          puuid: account.puuid,
          gameName: input.gameName,
          tagLine: input.tagLine,
          summonerId: summoner.id,
          accountId: summoner.accountId,
          region: "BR1",
          profileIcon: summoner.profileIconId,
          summonerLevel: summoner.summonerLevel,
        },
      });
      
      return riotAccount;
    }),

  getLinkedAccounts: protectedProcedure
    .query(async ({ ctx }) => {
      const accounts = await ctx.prisma.riotAccount.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { lastSync: "desc" },
      });
      
      return accounts;
    }),

  getPlayerAnalytics: premiumProcedure
    .input(z.object({
      puuid: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const analytics = await ctx.prisma.playerAnalytics.findFirst({
        where: {
          userId: ctx.session.user.id,
          puuid: input.puuid,
        },
        orderBy: { analyzedAt: "desc" },
      });
      
      if (!analytics) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No analytics found for this player",
        });
      }
      
      return analytics;
    }),
});