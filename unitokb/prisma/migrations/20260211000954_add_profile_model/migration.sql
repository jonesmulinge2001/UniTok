-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "academicLevel" TEXT NOT NULL,
    "skills" TEXT[],
    "bio" TEXT,
    "profileImage" TEXT,
    "coverPhoto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "interests" TEXT[],
    "course" TEXT,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_skills_idx" ON "Profile" USING GIN ("skills");

-- CreateIndex
CREATE INDEX "Profile_interests_idx" ON "Profile" USING GIN ("interests");

-- CreateIndex
CREATE INDEX "Profile_institutionId_idx" ON "Profile"("institutionId");

-- CreateIndex
CREATE INDEX "Profile_course_idx" ON "Profile"("course");

-- CreateIndex
CREATE INDEX "Profile_academicLevel_idx" ON "Profile"("academicLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
