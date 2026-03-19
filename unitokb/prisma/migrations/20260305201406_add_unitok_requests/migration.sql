-- CreateTable
CREATE TABLE "UniTokRequest" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "details" TEXT NOT NULL,
    "targetInstitution" TEXT,
    "requesterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniTokRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UniTokRequest_requesterId_idx" ON "UniTokRequest"("requesterId");

-- CreateIndex
CREATE INDEX "UniTokRequest_createdAt_idx" ON "UniTokRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "UniTokRequest" ADD CONSTRAINT "UniTokRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
