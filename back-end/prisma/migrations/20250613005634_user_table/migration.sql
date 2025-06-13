-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "account" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_account_key" ON "User"("account");
