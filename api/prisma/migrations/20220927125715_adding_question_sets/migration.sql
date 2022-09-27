-- CreateTable
CREATE TABLE "QuestionSet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "QuestionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionToQuestionSet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToQuestionSet_AB_unique" ON "_QuestionToQuestionSet"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToQuestionSet_B_index" ON "_QuestionToQuestionSet"("B");

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionSet" ADD CONSTRAINT "_QuestionToQuestionSet_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToQuestionSet" ADD CONSTRAINT "_QuestionToQuestionSet_B_fkey" FOREIGN KEY ("B") REFERENCES "QuestionSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
