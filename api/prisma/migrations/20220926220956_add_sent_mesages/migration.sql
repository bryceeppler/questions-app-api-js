-- CreateTable
CREATE TABLE "SentMessages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageSid" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "SentMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SentMessages" ADD CONSTRAINT "SentMessages_phone_fkey" FOREIGN KEY ("phone") REFERENCES "User"("phone") ON DELETE RESTRICT ON UPDATE CASCADE;
