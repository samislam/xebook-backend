-- CreateEnum
CREATE TYPE "CostBasisMethod" AS ENUM ('FIFO', 'WEIGHTED_AVERAGE');

-- CreateEnum
CREATE TYPE "RateSource" AS ENUM ('MANUAL', 'MARKET', 'REFERENCE');

-- CreateTable
CREATE TABLE "RateSnapshot" (
    "id" TEXT NOT NULL,
    "baseCurrency" VARCHAR(10) NOT NULL,
    "quoteCurrency" VARCHAR(10) NOT NULL,
    "rate" DECIMAL(20,8) NOT NULL,
    "source" "RateSource" NOT NULL DEFAULT 'MANUAL',
    "recorderUserId" TEXT,
    "note" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryLot" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "assetCurrency" VARCHAR(10) NOT NULL,
    "quantityAcquired" DECIMAL(20,8) NOT NULL,
    "remainingQuantity" DECIMAL(20,8) NOT NULL,
    "costCurrency" VARCHAR(10) NOT NULL,
    "totalCostAmount" DECIMAL(20,8) NOT NULL,
    "unitCostAmount" DECIMAL(20,8) NOT NULL,
    "sourceOrderId" TEXT,
    "sourceTransactionId" TEXT,
    "acquiredAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleExecution" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "counterpartyId" TEXT,
    "settlementAccountId" TEXT,
    "assetCurrency" VARCHAR(10) NOT NULL,
    "quantitySold" DECIMAL(20,8) NOT NULL,
    "feeCurrency" VARCHAR(10),
    "feeAmount" DECIMAL(20,8),
    "consumedQuantity" DECIMAL(20,8) NOT NULL,
    "proceedsCurrency" VARCHAR(10) NOT NULL,
    "proceedsAmount" DECIMAL(20,8) NOT NULL,
    "netProceedsAmount" DECIMAL(20,8) NOT NULL,
    "unitSalePrice" DECIMAL(20,8) NOT NULL,
    "costBasisMethod" "CostBasisMethod" NOT NULL DEFAULT 'FIFO',
    "costBasisCurrency" VARCHAR(10),
    "costBasisAmount" DECIMAL(20,8),
    "realizedProfitAmount" DECIMAL(20,8),
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleLotAllocation" (
    "id" TEXT NOT NULL,
    "saleExecutionId" TEXT NOT NULL,
    "inventoryLotId" TEXT NOT NULL,
    "quantityAllocated" DECIMAL(20,8) NOT NULL,
    "costAmount" DECIMAL(20,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleLotAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateSnapshot_baseCurrency_quoteCurrency_capturedAt_idx" ON "RateSnapshot"("baseCurrency", "quoteCurrency", "capturedAt");

-- CreateIndex
CREATE INDEX "RateSnapshot_quoteCurrency_capturedAt_idx" ON "RateSnapshot"("quoteCurrency", "capturedAt");

-- CreateIndex
CREATE INDEX "InventoryLot_ownerUserId_assetCurrency_acquiredAt_idx" ON "InventoryLot"("ownerUserId", "assetCurrency", "acquiredAt");

-- CreateIndex
CREATE INDEX "InventoryLot_assetCurrency_acquiredAt_idx" ON "InventoryLot"("assetCurrency", "acquiredAt");

-- CreateIndex
CREATE INDEX "InventoryLot_costCurrency_acquiredAt_idx" ON "InventoryLot"("costCurrency", "acquiredAt");

-- CreateIndex
CREATE INDEX "SaleExecution_ownerUserId_assetCurrency_occurredAt_idx" ON "SaleExecution"("ownerUserId", "assetCurrency", "occurredAt");

-- CreateIndex
CREATE INDEX "SaleExecution_counterpartyId_occurredAt_idx" ON "SaleExecution"("counterpartyId", "occurredAt");

-- CreateIndex
CREATE INDEX "SaleExecution_settlementAccountId_occurredAt_idx" ON "SaleExecution"("settlementAccountId", "occurredAt");

-- CreateIndex
CREATE INDEX "SaleExecution_proceedsCurrency_occurredAt_idx" ON "SaleExecution"("proceedsCurrency", "occurredAt");

-- CreateIndex
CREATE INDEX "SaleLotAllocation_inventoryLotId_idx" ON "SaleLotAllocation"("inventoryLotId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleLotAllocation_saleExecutionId_inventoryLotId_key" ON "SaleLotAllocation"("saleExecutionId", "inventoryLotId");

-- AddForeignKey
ALTER TABLE "InventoryLot" ADD CONSTRAINT "InventoryLot_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleExecution" ADD CONSTRAINT "SaleExecution_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleExecution" ADD CONSTRAINT "SaleExecution_counterpartyId_fkey" FOREIGN KEY ("counterpartyId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleExecution" ADD CONSTRAINT "SaleExecution_settlementAccountId_fkey" FOREIGN KEY ("settlementAccountId") REFERENCES "InstitutionAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleLotAllocation" ADD CONSTRAINT "SaleLotAllocation_saleExecutionId_fkey" FOREIGN KEY ("saleExecutionId") REFERENCES "SaleExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleLotAllocation" ADD CONSTRAINT "SaleLotAllocation_inventoryLotId_fkey" FOREIGN KEY ("inventoryLotId") REFERENCES "InventoryLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
