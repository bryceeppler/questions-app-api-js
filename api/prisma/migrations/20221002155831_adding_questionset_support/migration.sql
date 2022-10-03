-- AlterTable
ALTER TABLE "Relationship" ADD COLUMN     "questionSetId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "QuestionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
