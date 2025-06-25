import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { type Context } from "./context";
import { ZodError } from "zod";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);

const enforceUserIsPremium = enforceUserIsAuthenticated.unstable_pipe(
  ({ ctx, next }) => {
    if (!ctx.session.user.tier || ctx.session.user.tier === "FREE") {
      throw new TRPCError({ 
        code: "FORBIDDEN",
        message: "This feature requires a premium subscription" 
      });
    }
    return next({ ctx });
  }
);

export const premiumProcedure = t.procedure.use(enforceUserIsPremium);