/*
  Warnings:

  - A unique constraint covering the columns `[usercode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organisation` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usercode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN     "organisation" STRING NOT NULL;
ALTER TABLE "User" ADD COLUMN     "password" STRING NOT NULL;
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
ALTER TABLE "User" ADD COLUMN     "usercode" STRING NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_usercode_key" ON "User"("usercode");
