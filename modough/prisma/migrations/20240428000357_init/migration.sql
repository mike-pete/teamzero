/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BusStops" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stopId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Addresses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addressId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BusStops_stopId_key" ON "BusStops"("stopId");

-- CreateIndex
CREATE INDEX "BusStops_latitude_longitude_idx" ON "BusStops"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_addressId_key" ON "Addresses"("addressId");

-- CreateIndex
CREATE INDEX "Addresses_address_latitude_longitude_idx" ON "Addresses"("address", "latitude", "longitude");
