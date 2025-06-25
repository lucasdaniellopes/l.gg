import { createTRPCRouter } from "@/server/api/trpc";
import { playerRouter } from "./routers/playerRouter";
import { championRouter } from "./routers/championRouter";
import { userRouter } from "./routers/userRouter";

export const appRouter = createTRPCRouter({
  player: playerRouter,
  champion: championRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = appRouter.createCaller;