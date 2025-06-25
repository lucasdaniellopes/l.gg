import "server-only";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/context";

export const api = appRouter.createCaller(async () => {
  const mockHeaders = new Headers();
  mockHeaders.set("x-trpc-source", "rsc");

  return createTRPCContext({
    req: {
      headers: mockHeaders,
      url: "http://localhost:3000",
      method: "GET",
    } as Request,
    resHeaders: new Headers(),
    info: {
      isBatchCall: false,
      calls: [],
      accept: "application/jsonl",
      type: "query",
      connectionParams: null,
      signal: null,
      url: new URL("http://localhost:3000/api/trpc"),
    },
  });
});