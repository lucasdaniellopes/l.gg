import { createTRPCRouter } from "@/server/api/trpc";
import { playerRouter } from "./routers/playerRouter";
import { championRouter } from "./routers/championRouter";
import { userRouter } from "./routers/userRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  player: playerRouter,
  champion: championRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;