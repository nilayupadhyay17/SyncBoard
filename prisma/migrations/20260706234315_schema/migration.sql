/*
  Warnings:

  - You are about to drop the column `archivedAt` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the column `archivedAt` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the column `wipLimit` on the `Column` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CardLabel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkspaceInvite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_actorId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_createdById_fkey";

-- DropForeignKey
ALTER TABLE "CardComment" DROP CONSTRAINT "CardComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "CardComment" DROP CONSTRAINT "CardComment_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardLabel" DROP CONSTRAINT "CardLabel_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardLabel" DROP CONSTRAINT "CardLabel_labelId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_boardId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceInvite" DROP CONSTRAINT "WorkspaceInvite_invitedById_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceInvite" DROP CONSTRAINT "WorkspaceInvite_workspaceId_fkey";

-- DropIndex
DROP INDEX "Account_userId_idx";

-- DropIndex
DROP INDEX "Board_workspaceId_archivedAt_idx";

-- DropIndex
DROP INDEX "Board_workspaceId_position_idx";

-- DropIndex
DROP INDEX "Card_assigneeId_idx";

-- DropIndex
DROP INDEX "Card_boardId_archivedAt_idx";

-- DropIndex
DROP INDEX "Card_dueDate_idx";

-- DropIndex
DROP INDEX "Session_userId_idx";

-- DropIndex
DROP INDEX "Workspace_ownerId_idx";

-- DropIndex
DROP INDEX "WorkspaceMember_userId_idx";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "archivedAt",
DROP COLUMN "createdById",
DROP COLUMN "position";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "archivedAt",
DROP COLUMN "createdById",
DROP COLUMN "priority";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "color",
DROP COLUMN "wipLimit";

-- DropTable
DROP TABLE "Activity";

-- DropTable
DROP TABLE "CardComment";

-- DropTable
DROP TABLE "CardLabel";

-- DropTable
DROP TABLE "Label";

-- DropTable
DROP TABLE "WorkspaceInvite";

-- DropEnum
DROP TYPE "ActivityAction";

-- DropEnum
DROP TYPE "CardPriority";

-- DropEnum
DROP TYPE "InviteStatus";

-- CreateIndex
CREATE INDEX "Card_boardId_idx" ON "Card"("boardId");
