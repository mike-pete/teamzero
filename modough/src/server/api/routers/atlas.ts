import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const atlasRouter = createTRPCRouter({
    geocode: publicProcedure
    .input(z.object({address:z.string()})
    .query(({input})=>{

        return "OK",
    })
})

