-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "alias" TEXT,
    "email" TEXT NOT NULL,
    "pass" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "code" TEXT,
    "as2FA" BOOLEAN NOT NULL DEFAULT false,
    "onlineStatus" BOOLEAN NOT NULL DEFAULT false,
    "elo" INTEGER NOT NULL DEFAULT 1200,
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "tournamentWon" INTEGER NOT NULL DEFAULT 0,
    "pointScored" INTEGER NOT NULL DEFAULT 0,
    "pointConcede" INTEGER NOT NULL DEFAULT 0,
    "lastLogin" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("alias", "as2FA", "avatar", "bio", "code", "elo", "email", "id", "lose", "onlineStatus", "pass", "pointConcede", "pointScored", "tournamentWon", "username", "win") SELECT "alias", "as2FA", "avatar", "bio", "code", "elo", "email", "id", "lose", "onlineStatus", "pass", "pointConcede", "pointScored", "tournamentWon", "username", "win" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
