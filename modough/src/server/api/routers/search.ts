import { z } from "zod";

import type { PrismaClient } from "@prisma/client/extension";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

const AZURE_ATLAS_TOKEN = env.AZURE_ATLAS_TOKEN;

const getAddress = async (address: string, prisma: PrismaClient) => {
  const addressResult = await prisma.addresses.findFirst({
    where: { address: address },
  });
  return addressResult;
};

type GeocodeResult = {
  type: string;
  features: {
    type: string;
    geometry: { type: string; coordinates: number[] };
    bbox: number[];
    properties: object[];
  }[];
};

export const searchRoute = createTRPCRouter({
  getStops: publicProcedure.query(async () => {
    return await db.busStops.findMany();
  }),
  search: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // get coordinates of inserted address
      const addressResult = await getAddress(input.address, ctx.db);
      if (!addressResult) {
        // compile request
        const params = new URLSearchParams();
        params.append("subscription-key", AZURE_ATLAS_TOKEN);
        params.append("api-version", "2023-06-01");
        params.append("query", input.address);
        const request = new Request(
          "https://atlas.microsoft.com/geocode?" + params.toString(),
        );
        const response = await fetch(request);
        const result = (await response.json()) as GeocodeResult;
        const geometry = result.features[0]?.geometry;
        if (geometry?.coordinates[0] && geometry.coordinates[1]) {
          const address = db.addresses.create({
            data: {
              address: input.address,
              longitude: geometry.coordinates[0],
              latitude: geometry.coordinates[1],
            },
          });
          return address;
        }
      }
    }),
  getAddress: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ ctx, input }) => {
      // check db for address, null if not found
      return await getAddress(input.address, ctx.db);
    }),
});
