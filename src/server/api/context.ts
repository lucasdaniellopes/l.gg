import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma/prismaClient";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions);

  return {
    session,
    prisma,
    headers: opts.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;