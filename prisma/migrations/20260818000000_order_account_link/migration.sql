ALTER TABLE "Order"
ADD COLUMN "accountId" TEXT,
ADD COLUMN "accountEmail" TEXT;

CREATE INDEX "Order_accountId_idx" ON "Order"("accountId");
CREATE INDEX "Order_accountEmail_idx" ON "Order"("accountEmail");

