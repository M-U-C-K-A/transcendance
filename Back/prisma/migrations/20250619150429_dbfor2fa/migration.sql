-- CreateTable
CREATE TABLE "User" (
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
    "pointConcede" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "tmpUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT,
    "code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Friends" (
    "id1" INTEGER NOT NULL,
    "id2" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id1", "id2"),
    CONSTRAINT "Friends_id1_fkey" FOREIGN KEY ("id1") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Friends_id2_fkey" FOREIGN KEY ("id2") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
CREATE TABLE "Achievement" (
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

-- CreateTable
CREATE TABLE "Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hostId" INTEGER NOT NULL,
    "tournamentName" TEXT NOT NULL,
    "slot" INTEGER NOT NULL DEFAULT 4,
    "winnerId" INTEGER,
    "TDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tournament_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tournament_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TournamentParticipants" (
    "userId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "tournamentId"),
    CONSTRAINT "TournamentParticipants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TournamentParticipants_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "p1Id" INTEGER NOT NULL,
    "p2Id" INTEGER,
    "p1Elo" INTEGER NOT NULL,
    "p2Elo" INTEGER,
    "winnerId" INTEGER,
    "p1Score" INTEGER DEFAULT 0,
    "p2Score" INTEGER DEFAULT 0,
    "p1EloGain" INTEGER,
    "p2EloGain" INTEGER,
    "MDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchType" TEXT NOT NULL DEFAULT 'Quickplay',
    CONSTRAINT "Match_p1Id_fkey" FOREIGN KEY ("p1Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_p2Id_fkey" FOREIGN KEY ("p2Id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MatchHistory" (
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "matchId"),
    CONSTRAINT "MatchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "recipientId" INTEGER,
    "content" TEXT NOT NULL,
    "sendAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readStatus" BOOLEAN NOT NULL DEFAULT false,
    "isGeneral" BOOLEAN NOT NULL DEFAULT false,
    "messageType" TEXT NOT NULL DEFAULT 'Message',
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tmpUser_username_key" ON "tmpUser"("username");
