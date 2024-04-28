import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const add1 = prisma.addresses.create({
        data:{
            address: "5605 river run, el paso tx",
            latitude: 31.8628263,
            longitude: -106.6113663,
            busStopId: 1592
        }
    })
    const add2 = prisma.addresses.create({
        data: {
            address: "3257 altura, el paso tx",
            latitude: 31.797035,
            longitude: -106.454547,
            busStopId: 2318
        }
    });
    const add3 = prisma.addresses.create({
        data: {
            address: "8555 alameda, el paso tx",
            latitude: 31.703247880532533,
            longitude: -106.34188258383057,
            busStopId: 503
        }
    })
    const add4 = prisma.addresses.create({
        data: {
            address: "3620 keltner, el paso tx",
            latitude: 31.826367, 
            longitude: -106.450188,
            busStopId: 1719
        }
    })
}
main().then(async () => {
    await prisma.$disconnect();
}).catch(async (e) => {
    console.error(e)
    await prisma.$disconnect();
    process.exit(1)
})