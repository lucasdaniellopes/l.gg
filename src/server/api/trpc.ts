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

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure;

/**
 * Middleware for authenticated procedures
 */
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

/**
 * Protected (authenticated) procedure
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);

/**
 * Middleware for premium users only
 */
const enforceUserIsPremium = enforceUserIsAuthenticated.unstable_pipe(
  ({ ctx, next }) => {
    // @ts-expect-error - We added tier to session
    if (!ctx.session.user.tier || ctx.session.user.tier === "FREE") {
      throw new TRPCError({ 
        code: "FORBIDDEN",
        message: "This feature requires a premium subscription" 
      });
    }
    return next({ ctx });
  }
);

/**
 * Premium (paid tier) procedure
 */
export const premiumProcedure = t.procedure.use(enforceUserIsPremium);