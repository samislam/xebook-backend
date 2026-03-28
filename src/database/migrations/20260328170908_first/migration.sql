-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('BANK', 'WALLET', 'EXCHANGE', 'CASH_OFFICE', 'PAYMENT_APP', 'OTHER');

-- CreateEnum
CREATE TYPE "CounterpartyType" AS ENUM ('PERSON', 'BUSINESS', 'MERCHANT', 'TRADER', 'COMPANY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TransferMethod" AS ENUM ('CASH', 'BANK', 'WALLET', 'MANUAL', 'MIXED', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('OPENING_BALANCE', 'CASH_TO_USER_HOLD', 'ACCOUNT_TO_USER_HOLD', 'USER_RETURNS_FUNDS', 'INTERNAL_HOLDER_TRANSFER', 'INTERNAL_ACCOUNT_TRANSFER', 'COUNTERPARTY_IN', 'COUNTERPARTY_OUT', 'CREATE_DEBT', 'SETTLE_DEBT_DIRECT', 'SETTLE_DEBT_VIA_COUNTERPARTY', 'EXPENSE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('OPEN', 'PENDING_PAYMENT', 'PARTIALLY_SETTLED', 'SETTLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SettlementKind" AS ENUM ('PAYMENT', 'RETURN', 'FEE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "SettlementStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counterparty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CounterpartyType" NOT NULL DEFAULT 'UNKNOWN',
    "phone" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Counterparty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "type" "InstitutionType" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "title" TEXT NOT NULL,
    "accountIdentifier" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeldBalance" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "holderUserId" TEXT NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeldBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebtBalance" (
    "id" TEXT NOT NULL,
    "debtorUserId" TEXT NOT NULL,
    "creditorUserId" TEXT NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebtBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "method" "TransferMethod" NOT NULL DEFAULT 'BANK',
    "ownerUserId" TEXT NOT NULL,
    "initiatorUserId" TEXT NOT NULL,
    "fromUserId" TEXT,
    "toUserId" TEXT,
    "beneficiaryUserId" TEXT,
    "fromAccountId" TEXT,
    "toAccountId" TEXT,
    "fromCounterpartyId" TEXT,
    "toCounterpartyId" TEXT,
    "amount" DECIMAL(20,8) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "referenceCode" TEXT,
    "note" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "buyerUserId" TEXT NOT NULL,
    "sellerUserId" TEXT NOT NULL,
    "baseCurrency" VARCHAR(10) NOT NULL,
    "baseAmount" DECIMAL(20,8) NOT NULL,
    "quoteCurrency" VARCHAR(10) NOT NULL,
    "quoteAmount" DECIMAL(20,8) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "impliedRate" DECIMAL(20,8),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderSettlement" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" "SettlementKind" NOT NULL,
    "status" "SettlementStatus" NOT NULL DEFAULT 'PENDING',
    "payerUserId" TEXT,
    "payeeUserId" TEXT,
    "beneficiaryUserId" TEXT,
    "toCounterpartyId" TEXT,
    "toAccountId" TEXT,
    "fromAccountId" TEXT,
    "method" "TransferMethod" NOT NULL DEFAULT 'BANK',
    "currency" VARCHAR(10) NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL,
    "note" TEXT,
    "dueAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Counterparty_name_idx" ON "Counterparty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_country_key" ON "Institution"("name", "country");

-- CreateIndex
CREATE INDEX "InstitutionAccount_userId_idx" ON "InstitutionAccount"("userId");

-- CreateIndex
CREATE INDEX "InstitutionAccount_institutionId_idx" ON "InstitutionAccount"("institutionId");

-- CreateIndex
CREATE INDEX "InstitutionAccount_userId_currency_idx" ON "InstitutionAccount"("userId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionAccount_userId_institutionId_currency_title_key" ON "InstitutionAccount"("userId", "institutionId", "currency", "title");

-- CreateIndex
CREATE INDEX "HeldBalance_ownerUserId_idx" ON "HeldBalance"("ownerUserId");

-- CreateIndex
CREATE INDEX "HeldBalance_holderUserId_idx" ON "HeldBalance"("holderUserId");

-- CreateIndex
CREATE INDEX "HeldBalance_currency_idx" ON "HeldBalance"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "HeldBalance_ownerUserId_holderUserId_currency_key" ON "HeldBalance"("ownerUserId", "holderUserId", "currency");

-- CreateIndex
CREATE INDEX "DebtBalance_debtorUserId_idx" ON "DebtBalance"("debtorUserId");

-- CreateIndex
CREATE INDEX "DebtBalance_creditorUserId_idx" ON "DebtBalance"("creditorUserId");

-- CreateIndex
CREATE INDEX "DebtBalance_currency_idx" ON "DebtBalance"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "DebtBalance_debtorUserId_creditorUserId_currency_key" ON "DebtBalance"("debtorUserId", "creditorUserId", "currency");

-- CreateIndex
CREATE INDEX "Transaction_ownerUserId_occurredAt_idx" ON "Transaction"("ownerUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_initiatorUserId_occurredAt_idx" ON "Transaction"("initiatorUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_fromUserId_occurredAt_idx" ON "Transaction"("fromUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_toUserId_occurredAt_idx" ON "Transaction"("toUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_beneficiaryUserId_occurredAt_idx" ON "Transaction"("beneficiaryUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_fromAccountId_occurredAt_idx" ON "Transaction"("fromAccountId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_toAccountId_occurredAt_idx" ON "Transaction"("toAccountId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_fromCounterpartyId_occurredAt_idx" ON "Transaction"("fromCounterpartyId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_toCounterpartyId_occurredAt_idx" ON "Transaction"("toCounterpartyId", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_currency_occurredAt_idx" ON "Transaction"("currency", "occurredAt");

-- CreateIndex
CREATE INDEX "Transaction_type_occurredAt_idx" ON "Transaction"("type", "occurredAt");

-- CreateIndex
CREATE INDEX "Order_buyerUserId_createdAt_idx" ON "Order"("buyerUserId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_sellerUserId_createdAt_idx" ON "Order"("sellerUserId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "OrderSettlement_orderId_status_idx" ON "OrderSettlement"("orderId", "status");

-- CreateIndex
CREATE INDEX "OrderSettlement_payerUserId_createdAt_idx" ON "OrderSettlement"("payerUserId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderSettlement_payeeUserId_createdAt_idx" ON "OrderSettlement"("payeeUserId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderSettlement_beneficiaryUserId_createdAt_idx" ON "OrderSettlement"("beneficiaryUserId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderSettlement_toCounterpartyId_createdAt_idx" ON "OrderSettlement"("toCounterpartyId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderSettlement_toAccountId_createdAt_idx" ON "OrderSettlement"("toAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderSettlement_fromAccountId_createdAt_idx" ON "OrderSettlement"("fromAccountId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderSettlement_currency_createdAt_idx" ON "OrderSettlement"("currency", "createdAt");

-- AddForeignKey
ALTER TABLE "InstitutionAccount" ADD CONSTRAINT "InstitutionAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionAccount" ADD CONSTRAINT "InstitutionAccount_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeldBalance" ADD CONSTRAINT "HeldBalance_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeldBalance" ADD CONSTRAINT "HeldBalance_holderUserId_fkey" FOREIGN KEY ("holderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtBalance" ADD CONSTRAINT "DebtBalance_debtorUserId_fkey" FOREIGN KEY ("debtorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebtBalance" ADD CONSTRAINT "DebtBalance_creditorUserId_fkey" FOREIGN KEY ("creditorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_initiatorUserId_fkey" FOREIGN KEY ("initiatorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_beneficiaryUserId_fkey" FOREIGN KEY ("beneficiaryUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "InstitutionAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "InstitutionAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromCounterpartyId_fkey" FOREIGN KEY ("fromCounterpartyId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toCounterpartyId_fkey" FOREIGN KEY ("toCounterpartyId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerUserId_fkey" FOREIGN KEY ("buyerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerUserId_fkey" FOREIGN KEY ("sellerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSettlement" ADD CONSTRAINT "OrderSettlement_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSettlement" ADD CONSTRAINT "OrderSettlement_payerUserId_fkey" FOREIGN KEY ("payerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSettlement" ADD CONSTRAINT "OrderSettlement_payeeUserId_fkey" FOREIGN KEY ("payeeUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSettlement" ADD CONSTRAINT "OrderSettlement_beneficiaryUserId_fkey" FOREIGN KEY ("beneficiaryUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSettlement" ADD CONSTRAINT "OrderSettlement_toCounterpartyId_fkey" FOREIGN KEY ("toCounterpartyId") REFERENCES "Counterparty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSettlement" ADD CONSTRAINT "OrderSettlement_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "InstitutionAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderSettlement" ADD CONSTRAINT "OrderSettlement_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "InstitutionAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
