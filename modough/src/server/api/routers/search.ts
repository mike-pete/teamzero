import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const searchRoute = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ address: z.string().min(1) }))
    .mutation(async ({ input }) => {
      
      return {
        greeting: `Hello ${input.address}`,
      };
    }),
});
