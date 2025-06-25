import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { env } from "process";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/context";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? () => {
          }
        : undefined,
  });

export { handler as GET, handler as POST };