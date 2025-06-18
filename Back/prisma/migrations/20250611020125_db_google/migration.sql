-- CreateTable
CREATE TABLE "tmpUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "tmpUser_username_key" ON "tmpUser"("username");
