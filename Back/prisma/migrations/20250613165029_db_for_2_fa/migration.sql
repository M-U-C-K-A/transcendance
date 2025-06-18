/*
  Warnings:

  - Added the required column `code` to the `tmpUser` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tmpUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT,
    "code" TEXT NOT NULL
);
INSERT INTO "new_tmpUser" ("email", "id", "pass", "username") SELECT "email", "id", "pass", "username" FROM "tmpUser";
DROP TABLE "tmpUser";
ALTER TABLE "new_tmpUser" RENAME TO "tmpUser";
CREATE UNIQUE INDEX "tmpUser_username_key" ON "tmpUser"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
