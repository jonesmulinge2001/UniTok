/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropTable
DROP TABLE "public"."Comment";

-- DropTable
DROP TABLE "public"."Like";

-- DropTable
DROP TABLE "public"."Post";

-- CreateTable
CREATE TABLE "UniTokVideo" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniTokVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniTokVideoLike" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniTokVideoLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniTokComment" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDeleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniTokComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UniTokVideo_creatorId_idx" ON "UniTokVideo"("creatorId");

-- CreateIndex
CREATE INDEX "UniTokVideo_createdAt_idx" ON "UniTokVideo"("createdAt");

-- CreateIndex
CREATE INDEX "UniTokVideoLike_videoId_idx" ON "UniTokVideoLike"("videoId");

-- CreateIndex
CREATE INDEX "UniTokVideoLike_userId_idx" ON "UniTokVideoLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UniTokVideoLike_videoId_userId_key" ON "UniTokVideoLike"("videoId", "userId");

-- CreateIndex
CREATE INDEX "UniTokComment_videoId_idx" ON "UniTokComment"("videoId");

-- CreateIndex
CREATE INDEX "UniTokComment_authorId_idx" ON "UniTokComment"("authorId");

-- AddForeignKey
ALTER TABLE "UniTokVideo" ADD CONSTRAINT "UniTokVideo_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniTokVideoLike" ADD CONSTRAINT "UniTokVideoLike_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "UniTokVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniTokVideoLike" ADD CONSTRAINT "UniTokVideoLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniTokComment" ADD CONSTRAINT "UniTokComment_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "UniTokVideo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniTokComment" ADD CONSTRAINT "UniTokComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
