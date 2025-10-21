-- CreateTable
CREATE TABLE "UserTransactions" (
    "id" TEXT NOT NULL,
    "transactionSignature" TEXT NOT NULL,
    "userPublicKey" TEXT NOT NULL,
    "slot" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTransactions_transactionSignature_key" ON "UserTransactions"("transactionSignature");

-- CreateIndex
CREATE INDEX "UserTransactions_slot_idx" ON "UserTransactions"("slot");

-- CreateIndex
CREATE INDEX "UserTransactions_userPublicKey_idx" ON "UserTransactions"("userPublicKey");

-- CreateIndex
CREATE INDEX "UserTransactions_userPublicKey_slot_idx" ON "UserTransactions"("userPublicKey", "slot");
