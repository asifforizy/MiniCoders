-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'MEMORY_LIMIT_EXCEEDED';

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "constraints" TEXT,
ADD COLUMN     "hints" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "inputFormat" TEXT,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "memoryLimit" INTEGER NOT NULL DEFAULT 128000,
ADD COLUMN     "number" INTEGER,
ADD COLUMN     "outputFormat" TEXT,
ADD COLUMN     "starterCode" JSONB,
ADD COLUMN     "supportedLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "timeLimit" DOUBLE PRECISION NOT NULL DEFAULT 2,
ADD COLUMN     "topic" TEXT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "passedTestCases" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalTestCases" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "test_cases" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "solved" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "solvedAt" TIMESTAMP(3),
    "lastAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "test_cases_problemId_isPublic_idx" ON "test_cases"("problemId", "isPublic");

-- CreateIndex
CREATE UNIQUE INDEX "test_cases_problemId_order_key" ON "test_cases"("problemId", "order");

-- CreateIndex
CREATE INDEX "problem_progress_userId_solved_idx" ON "problem_progress"("userId", "solved");

-- CreateIndex
CREATE UNIQUE INDEX "problem_progress_userId_problemId_key" ON "problem_progress"("userId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_number_key" ON "Problem"("number");

-- CreateIndex
CREATE INDEX "Problem_topic_idx" ON "Problem"("topic");

-- CreateIndex
CREATE INDEX "Problem_isPublished_idx" ON "Problem"("isPublished");

-- CreateIndex
CREATE INDEX "Submission_userId_createdAt_idx" ON "Submission"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_progress" ADD CONSTRAINT "problem_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_progress" ADD CONSTRAINT "problem_progress_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
