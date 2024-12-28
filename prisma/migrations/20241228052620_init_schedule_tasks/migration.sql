-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('break', 'work');

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "agent_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "account_id" INTEGER NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" "TaskType" NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_schedule_account_id" ON "Schedule"("account_id");

-- CreateIndex
CREATE INDEX "idx_task_account_id" ON "Task"("account_id");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
