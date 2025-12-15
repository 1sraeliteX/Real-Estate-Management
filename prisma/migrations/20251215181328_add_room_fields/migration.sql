-- AlterTable
ALTER TABLE "users" ADD COLUMN "address" TEXT;

-- CreateTable
CREATE TABLE "room_assignment_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "occupantId" TEXT,
    "propertyId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "assignedBy" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "effectiveDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_properties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "yearlyRent" INTEGER NOT NULL,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" INTEGER,
    "description" TEXT NOT NULL,
    "amenities" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "yearBuilt" INTEGER NOT NULL,
    "parkingSpaces" TEXT NOT NULL,
    "numberOfRooms" INTEGER,
    "numberOfKitchens" INTEGER,
    "numberOfBathrooms" INTEGER,
    "waterAvailability" TEXT,
    "userId" TEXT,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "properties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_properties" ("address", "amenities", "area", "bathrooms", "bedrooms", "createdAt", "description", "id", "images", "name", "numberOfBathrooms", "numberOfKitchens", "numberOfRooms", "parkingSpaces", "status", "type", "updatedAt", "waterAvailability", "yearBuilt", "yearlyRent") SELECT "address", "amenities", "area", "bathrooms", "bedrooms", "createdAt", "description", "id", "images", "name", "numberOfBathrooms", "numberOfKitchens", "numberOfRooms", "parkingSpaces", "status", "type", "updatedAt", "waterAvailability", "yearBuilt", "yearlyRent" FROM "properties";
DROP TABLE "properties";
ALTER TABLE "new_properties" RENAME TO "properties";
CREATE INDEX "properties_type_idx" ON "properties"("type");
CREATE INDEX "properties_status_idx" ON "properties"("status");
CREATE INDEX "properties_userId_idx" ON "properties"("userId");
CREATE INDEX "properties_isCustom_idx" ON "properties"("isCustom");
CREATE INDEX "properties_createdAt_idx" ON "properties"("createdAt");
CREATE INDEX "properties_name_idx" ON "properties"("name");
CREATE INDEX "properties_type_status_idx" ON "properties"("type", "status");
CREATE INDEX "properties_userId_isCustom_idx" ON "properties"("userId", "isCustom");
CREATE TABLE "new_room_occupants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "nextOfKin" TEXT NOT NULL,
    "nextOfKinPhone" TEXT NOT NULL,
    "numberOfOccupants" INTEGER NOT NULL,
    "kitchenAccess" TEXT,
    "rentStartDate" TEXT NOT NULL,
    "rentExpiryDate" TEXT NOT NULL,
    "totalRent" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "assignmentStatus" TEXT NOT NULL DEFAULT 'active',
    "moveInDate" TEXT,
    "moveOutDate" TEXT,
    "securityDeposit" INTEGER NOT NULL DEFAULT 0,
    "depositStatus" TEXT NOT NULL DEFAULT 'pending',
    "emergencyContact" TEXT,
    "occupation" TEXT,
    "idNumber" TEXT,
    "issues" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "assignedBy" TEXT,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "room_occupants_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_room_occupants" ("amountPaid", "createdAt", "id", "issues", "name", "nextOfKin", "nextOfKinPhone", "notes", "numberOfOccupants", "paymentStatus", "phone", "rentExpiryDate", "rentStartDate", "roomId", "totalRent", "updatedAt") SELECT "amountPaid", "createdAt", "id", "issues", "name", "nextOfKin", "nextOfKinPhone", "notes", "numberOfOccupants", "paymentStatus", "phone", "rentExpiryDate", "rentStartDate", "roomId", "totalRent", "updatedAt" FROM "room_occupants";
DROP TABLE "room_occupants";
ALTER TABLE "new_room_occupants" RENAME TO "room_occupants";
CREATE INDEX "room_occupants_roomId_idx" ON "room_occupants"("roomId");
CREATE INDEX "room_occupants_assignmentStatus_idx" ON "room_occupants"("assignmentStatus");
CREATE INDEX "room_occupants_paymentStatus_idx" ON "room_occupants"("paymentStatus");
CREATE INDEX "room_occupants_rentExpiryDate_idx" ON "room_occupants"("rentExpiryDate");
CREATE INDEX "room_occupants_roomId_assignmentStatus_idx" ON "room_occupants"("roomId", "assignmentStatus");
CREATE TABLE "new_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "yearlyRent" INTEGER NOT NULL,
    "maxOccupants" INTEGER NOT NULL DEFAULT 1,
    "currentOccupants" INTEGER NOT NULL DEFAULT 0,
    "roomType" TEXT,
    "amenities" TEXT,
    "floor" INTEGER,
    "size" REAL,
    "hasPrivateBath" BOOLEAN NOT NULL DEFAULT false,
    "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
    "rentStartDate" TEXT,
    "rentExpiryDate" TEXT,
    "lastOccupiedDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rooms_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_rooms" ("createdAt", "id", "propertyId", "propertyName", "rentExpiryDate", "rentStartDate", "roomNumber", "status", "updatedAt", "yearlyRent") SELECT "createdAt", "id", "propertyId", "propertyName", "rentExpiryDate", "rentStartDate", "roomNumber", "status", "updatedAt", "yearlyRent" FROM "rooms";
DROP TABLE "rooms";
ALTER TABLE "new_rooms" RENAME TO "rooms";
CREATE INDEX "rooms_propertyId_idx" ON "rooms"("propertyId");
CREATE INDEX "rooms_status_idx" ON "rooms"("status");
CREATE INDEX "rooms_propertyId_status_idx" ON "rooms"("propertyId", "status");
CREATE INDEX "rooms_maxOccupants_currentOccupants_idx" ON "rooms"("maxOccupants", "currentOccupants");
CREATE TABLE "new_user_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "appName" TEXT NOT NULL DEFAULT 'Cornerstone Realty',
    "rentDueReminderDays" INTEGER NOT NULL DEFAULT 7,
    "hasSeenWelcomeGuide" BOOLEAN NOT NULL DEFAULT false,
    "reminderText" TEXT,
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "currencySymbol" TEXT NOT NULL DEFAULT '₦',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_settings" ("appName", "createdAt", "hasSeenWelcomeGuide", "id", "rentDueReminderDays", "updatedAt", "userId") SELECT "appName", "createdAt", "hasSeenWelcomeGuide", "id", "rentDueReminderDays", "updatedAt", "userId" FROM "user_settings";
DROP TABLE "user_settings";
ALTER TABLE "new_user_settings" RENAME TO "user_settings";
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "room_assignment_history_roomId_idx" ON "room_assignment_history"("roomId");

-- CreateIndex
CREATE INDEX "room_assignment_history_occupantId_idx" ON "room_assignment_history"("occupantId");

-- CreateIndex
CREATE INDEX "room_assignment_history_propertyId_idx" ON "room_assignment_history"("propertyId");

-- CreateIndex
CREATE INDEX "room_assignment_history_action_idx" ON "room_assignment_history"("action");

-- CreateIndex
CREATE INDEX "room_assignment_history_effectiveDate_idx" ON "room_assignment_history"("effectiveDate");
