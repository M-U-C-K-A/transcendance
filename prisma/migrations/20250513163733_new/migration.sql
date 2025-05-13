/*
  Warnings:

  - You are about to drop the `UserInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "UserInfo_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserInfo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "alias" TEXT,
    "email" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "avatar" BLOB,
    "bio" TEXT,
    "onlineStatus" BOOLEAN NOT NULL DEFAULT false,
    "elo" INTEGER NOT NULL DEFAULT 1200,
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "tournamentWon" INTEGER NOT NULL DEFAULT 0,
    "pointScored" INTEGER NOT NULL DEFAULT 0,
    "pointConcede" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Block" (
    "id1" INTEGER NOT NULL,
    "id2" INTEGER NOT NULL,

    PRIMARY KEY ("id1", "id2"),
    CONSTRAINT "Block_id1_fkey" FOREIGN KEY ("id1") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Block_id2_fkey" FOREIGN KEY ("id2") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "matchType" TEXT NOT NULL DEFAULT 'Quickplay',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" DATETIME NOT NULL,
    CONSTRAINT "Invitation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Invitation_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "sendAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readStatus" BOOLEAN NOT NULL,
    "status" BOOLEAN NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'Message',
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "beginner" BOOLEAN NOT NULL DEFAULT false,
    "humiliation" BOOLEAN NOT NULL DEFAULT false,
    "shamefullLose" BOOLEAN NOT NULL DEFAULT false,
    "rivality" BOOLEAN NOT NULL DEFAULT false,
    "fairPlay" BOOLEAN NOT NULL DEFAULT false,
    "lastSecond" BOOLEAN NOT NULL DEFAULT false,
    "comeback" BOOLEAN NOT NULL DEFAULT false,
    "longGame" BOOLEAN NOT NULL DEFAULT false,
    "winTournament" BOOLEAN NOT NULL DEFAULT false,
    "friendly" BOOLEAN NOT NULL DEFAULT false,
    "rank1" BOOLEAN NOT NULL DEFAULT false,
    "looser" BOOLEAN NOT NULL DEFAULT false,
    "winner" BOOLEAN NOT NULL DEFAULT false,
    "scorer" BOOLEAN NOT NULL DEFAULT false,
    "emoji" BOOLEAN NOT NULL DEFAULT false,
    "rage" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Achievement_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Achievement" ("beginner", "comeback", "emoji", "fairPlay", "friendly", "humiliation", "id", "lastSecond", "longGame", "looser", "rage", "rank1", "rivality", "scorer", "shamefullLose", "winTournament", "winner") SELECT "beginner", "comeback", "emoji", "fairPlay", "friendly", "humiliation", "id", "lastSecond", "longGame", "looser", "rage", "rank1", "rivality", "scorer", "shamefullLose", "winTournament", "winner" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
CREATE TABLE "new_Friends" (
    "id1" INTEGER NOT NULL,
    "id2" INTEGER NOT NULL,

    PRIMARY KEY ("id1", "id2"),
    CONSTRAINT "Friends_id1_fkey" FOREIGN KEY ("id1") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friends_id2_fkey" FOREIGN KEY ("id2") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Friends" ("id1", "id2") SELECT "id1", "id2" FROM "Friends";
DROP TABLE "Friends";
ALTER TABLE "new_Friends" RENAME TO "Friends";
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "p1Id" INTEGER NOT NULL,
    "p2Id" INTEGER NOT NULL,
    "p1Elo" INTEGER NOT NULL,
    "p2Elo" INTEGER NOT NULL,
    "winnerId" INTEGER,
    "p1Score" INTEGER NOT NULL DEFAULT 0,
    "p2Score" INTEGER NOT NULL DEFAULT 0,
    "p1EloGain" INTEGER NOT NULL,
    "p2EloGain" INTEGER NOT NULL,
    "MDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchType" TEXT NOT NULL DEFAULT 'Quickplay',
    CONSTRAINT "Match_p1Id_fkey" FOREIGN KEY ("p1Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_p2Id_fkey" FOREIGN KEY ("p2Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("MDate", "id", "matchType", "p1Elo", "p1EloGain", "p1Id", "p1Score", "p2Elo", "p2EloGain", "p2Id", "p2Score", "winnerId") SELECT "MDate", "id", "matchType", "p1Elo", "p1EloGain", "p1Id", "p1Score", "p2Elo", "p2EloGain", "p2Id", "p2Score", "winnerId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_MatchHistory" (
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "matchId"),
    CONSTRAINT "MatchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MatchHistory" ("matchId", "userId") SELECT "matchId", "userId" FROM "MatchHistory";
DROP TABLE "MatchHistory";
ALTER TABLE "new_MatchHistory" RENAME TO "MatchHistory";
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL DEFAULT 4,
    "winnerId" INTEGER,
    "TDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tournament_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tournament_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tournament" ("TDate", "hostId", "id", "slot", "winnerId") SELECT "TDate", "hostId", "id", "slot", "winnerId" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE TABLE "new_TournamentHistory" (
    "userId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "tournamentId"),
    CONSTRAINT "TournamentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TournamentHistory_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TournamentHistory" ("tournamentId", "userId") SELECT "tournamentId", "userId" FROM "TournamentHistory";
DROP TABLE "TournamentHistory";
ALTER TABLE "new_TournamentHistory" RENAME TO "TournamentHistory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
