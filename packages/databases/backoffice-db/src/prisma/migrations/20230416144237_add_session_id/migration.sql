-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authenticatedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN     "sessionId" STRING;
