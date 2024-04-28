import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN ?? '',
});

const adapter = new PrismaLibSQL(libsql);

const createPrismaClient = () =>
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const db = createPrismaClient()


async function main() {
    const add1 = db.addresses.create({
        data:{
            address: "5605 river run, el paso tx",
            latitude: 31.8628263,
            longitude: -106.6113663,
            busStopId: 1592
        }
    })
    const add2 = db.addresses.create({
        data: {
            address: "3257 altura, el paso tx",
            latitude: 31.797035,
            longitude: -106.454547,
            busStopId: 2318
        }
    });
    const add3 = db.addresses.create({
        data: {
            address: "8555 alameda, el paso tx",
            latitude: 31.703247880532533,
            longitude: -106.34188258383057,
            busStopId: 503
        }
    })
    const add4 = db.addresses.create({
        data: {
            address: "3620 keltner, el paso tx",
            latitude: 31.826367, 
            longitude: -106.450188,
            busStopId: 1719
        }
    })
}
main().then(async () => {
    await db.$disconnect();
}).catch(async (e) => {
    console.error(e)
    await db.$disconnect();
    process.exit(1)
})