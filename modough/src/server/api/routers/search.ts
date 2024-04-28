import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { env } from '~/env'

const AZURE_ATLAS_TOKEN = env.AZURE_ATLAS_TOKEN

export const searchRoute = createTRPCRouter({
  getStops: publicProcedure.query(async () => {}),
  search: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ input }) => {
      const stops = await db.busStops.findMany();

      console.log("stops", stops);
      return stops;
      return {
        greeting: `Hello ${input.address}`,
      };
      // compile request
      const params = new URLSearchParams()
      params.append("subscription-key", AZURE_ATLAS_TOKEN)
      params.append("api-version", "2023-06-01")
      params.append("query", input.address);
      const request = new Request('https://atlas.microsoft.com/geocode?' + params.toString())
      const result = fetch(request).then(res=>res.json().then((coordinates:{type:string,features:object[]})=>coordinates))

      return result
    }),
});
