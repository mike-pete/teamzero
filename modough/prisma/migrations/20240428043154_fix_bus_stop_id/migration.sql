/*
  Warnings:

  - You are about to alter the column `busStopId` on the `Addresses` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Addresses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "busStopId" INTEGER NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    CONSTRAINT "Addresses_busStopId_fkey" FOREIGN KEY ("busStopId") REFERENCES "BusStops" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Addresses" ("address", "busStopId", "id", "latitude", "longitude") SELECT "address", "busStopId", "id", "latitude", "longitude" FROM "Addresses";
DROP TABLE "Addresses";
ALTER TABLE "new_Addresses" RENAME TO "Addresses";
CREATE UNIQUE INDEX "Addresses_address_key" ON "Addresses"("address");
CREATE INDEX "Addresses_address_latitude_longitude_idx" ON "Addresses"("address", "latitude", "longitude");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
