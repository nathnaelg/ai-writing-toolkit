-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('MEETING_SUMMARY', 'PROJECT_UPDATE', 'WEEKLY_REPORT', 'INCIDENT_REPORT', 'BUSINESS_PROPOSAL', 'RESEARCH_SUMMARY');

-- CreateEnum
CREATE TYPE "QueryType" AS ENUM ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'JOIN', 'AGGREGATE', 'OTHER');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_processing_history" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "processedText" TEXT NOT NULL,
    "operation" VARCHAR(50) NOT NULL,
    "tone" VARCHAR(20),
    "wordCountOriginal" INTEGER NOT NULL DEFAULT 0,
    "wordCountProcessed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "text_processing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "jobTitle" VARCHAR(255) NOT NULL,
    "industry" VARCHAR(100),
    "experience" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "generatedResume" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "bulletPoints" TEXT NOT NULL,
    "generatedReport" TEXT NOT NULL,
    "tone" VARCHAR(50),
    "audience" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sql_queries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "naturalLanguage" TEXT NOT NULL,
    "generatedSql" TEXT NOT NULL,
    "queryType" "QueryType" NOT NULL,
    "database" VARCHAR(50),
    "explanation" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sql_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_base" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "category" VARCHAR(100),
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "text_processing_history_userId_createdAt_idx" ON "text_processing_history"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "text_processing_history_operation_idx" ON "text_processing_history"("operation");

-- CreateIndex
CREATE INDEX "resumes_userId_createdAt_idx" ON "resumes"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "resumes_industry_idx" ON "resumes"("industry");

-- CreateIndex
CREATE INDEX "reports_userId_createdAt_idx" ON "reports"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "reports_reportType_idx" ON "reports"("reportType");

-- CreateIndex
CREATE INDEX "sql_queries_userId_createdAt_idx" ON "sql_queries"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "sql_queries_queryType_idx" ON "sql_queries"("queryType");

-- CreateIndex
CREATE INDEX "sql_queries_database_idx" ON "sql_queries"("database");

-- CreateIndex
CREATE INDEX "conversations_userId_createdAt_idx" ON "conversations"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_conversationId_timestamp_idx" ON "messages"("conversationId", "timestamp");

-- CreateIndex
CREATE INDEX "knowledge_base_userId_isActive_idx" ON "knowledge_base"("userId", "isActive");

-- CreateIndex
CREATE INDEX "knowledge_base_category_idx" ON "knowledge_base"("category");

-- AddForeignKey
ALTER TABLE "text_processing_history" ADD CONSTRAINT "text_processing_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sql_queries" ADD CONSTRAINT "sql_queries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_base" ADD CONSTRAINT "knowledge_base_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
