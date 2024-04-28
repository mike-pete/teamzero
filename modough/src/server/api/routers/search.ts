import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const searchRoute = createTRPCRouter({
  getStops: publicProcedure.query(async () => {
    const stops = await db.busStops.findMany();

    console.log("stops", stops);
    return stops;
  }),
  search: publicProcedure
    .input(z.object({ address: z.string().min(1) }))
    .mutation(async ({ input }) => {
      return {
        address: input.address,
        nearestStop: { id: 1, name: "Stop 1", location: { lat: 0, lng: 0 } },
      };
    }),
});
