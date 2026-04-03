import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto'
import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions } from '@nestjs/swagger'

export const createTransactionOperation: ApiOperationOptions = {
  summary: 'Create transaction',
  description:
    'Creates one transaction ledger row and applies the related held-balance or debt-balance rules according to the transaction type.',
}

export const createTransactionBody: ApiBodyOptions = {
  type: CreateTransactionDto,
  examples: {
    openingBalance: {
      summary: 'Opening balance',
      description: 'Initialize a held balance for an owner user and holder user.',
      value: {
        type: 'OPENING_BALANCE',
        method: 'MANUAL',
        ownerUserId: 'user_owner_id',
        toUserId: 'holder_user_id',
        amount: '5000',
        currency: 'USD',
        note: 'Opening held balance',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    cashToUserHold: {
      summary: 'Cash to user hold',
      description: 'Cash is handed to a user to hold for the owner user.',
      value: {
        type: 'CASH_TO_USER_HOLD',
        method: 'CASH',
        ownerUserId: 'user_owner_id',
        toUserId: 'holder_user_id',
        amount: '1000',
        currency: 'USD',
        note: 'Cash handed to user to hold',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    accountToUserHold: {
      summary: 'Account to user hold',
      description: 'Funds are routed into a user account and treated as held for the owner user.',
      value: {
        type: 'ACCOUNT_TO_USER_HOLD',
        method: 'BANK',
        ownerUserId: 'user_owner_id',
        toUserId: 'holder_user_id',
        toAccountId: 'destination_account_id',
        amount: '2500',
        currency: 'USD',
        referenceCode: 'BANK-REF-001',
        note: 'Transferred to user account to hold',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    userReturnsFunds: {
      summary: 'User returns funds',
      description: 'A holder user returns funds that were being held for the owner user.',
      value: {
        type: 'USER_RETURNS_FUNDS',
        method: 'BANK',
        ownerUserId: 'user_owner_id',
        fromUserId: 'holder_user_id',
        fromAccountId: 'source_account_id',
        amount: '500',
        currency: 'USD',
        referenceCode: 'RETURN-001',
        note: 'User returned held funds',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    internalHolderTransfer: {
      summary: 'Internal holder transfer',
      description: 'Move held funds from one internal holder to another for the same owner.',
      value: {
        type: 'INTERNAL_HOLDER_TRANSFER',
        method: 'MANUAL',
        ownerUserId: 'user_owner_id',
        fromUserId: 'old_holder_user_id',
        toUserId: 'new_holder_user_id',
        amount: '300',
        currency: 'USD',
        note: 'Move held balance between holders',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    internalAccountTransfer: {
      summary: 'Internal account transfer',
      description:
        'A user moves funds between two of their own institution accounts. This is mainly routing and analytics history.',
      value: {
        type: 'INTERNAL_ACCOUNT_TRANSFER',
        method: 'BANK',
        ownerUserId: 'user_owner_id',
        fromUserId: 'same_user_id',
        toUserId: 'same_user_id',
        fromAccountId: 'source_account_id',
        toAccountId: 'destination_account_id',
        amount: '750',
        currency: 'USD',
        referenceCode: 'MOVE-001',
        note: 'Move between own bank accounts',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    counterpartyIn: {
      summary: 'Counterparty in',
      description: 'An external counterparty sends money into the system or into a user account.',
      value: {
        type: 'COUNTERPARTY_IN',
        method: 'BANK',
        ownerUserId: 'user_owner_id',
        toUserId: 'receiver_user_id',
        toAccountId: 'destination_account_id',
        fromCounterpartyId: 'source_counterparty_id',
        amount: '900',
        currency: 'USD',
        referenceCode: 'IN-001',
        note: 'Inbound transfer from external counterparty',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    counterpartyOut: {
      summary: 'Counterparty out',
      description:
        'Money is paid out from the system or a user account to an external counterparty.',
      value: {
        type: 'COUNTERPARTY_OUT',
        method: 'BANK',
        ownerUserId: 'user_owner_id',
        fromUserId: 'payer_user_id',
        fromAccountId: 'source_account_id',
        toCounterpartyId: 'destination_counterparty_id',
        amount: '300',
        currency: 'USD',
        referenceCode: 'OUT-001',
        note: 'Outbound transfer to external counterparty',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    createDebt: {
      summary: 'Create debt',
      description: 'Create a debt between two internal users.',
      value: {
        type: 'CREATE_DEBT',
        method: 'MANUAL',
        fromUserId: 'creditor_user_id',
        toUserId: 'debtor_user_id',
        amount: '45000',
        currency: 'TRY',
        note: 'Create debt between two internal users',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    settleDebtDirect: {
      summary: 'Settle debt direct',
      description: 'Settle a debt directly to another internal user.',
      value: {
        type: 'SETTLE_DEBT_DIRECT',
        method: 'BANK',
        ownerUserId: 'debtor_user_id',
        fromUserId: 'holder_user_id',
        toUserId: 'creditor_user_id',
        fromAccountId: 'source_account_id',
        toAccountId: 'destination_account_id',
        amount: '15000',
        currency: 'TRY',
        referenceCode: 'SETTLE-001',
        note: 'Direct settlement of debt',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    settleDebtViaCounterparty: {
      summary: 'Settle debt via counterparty',
      description:
        'Use funds held by another user to pay an external counterparty for a beneficiary user and reduce the debt.',
      value: {
        type: 'SETTLE_DEBT_VIA_COUNTERPARTY',
        method: 'BANK',
        ownerUserId: 'debtor_user_id',
        fromUserId: 'holder_user_id',
        beneficiaryUserId: 'beneficiary_user_id',
        toCounterpartyId: 'counterparty_id',
        fromAccountId: 'source_account_id',
        amount: '200',
        currency: 'USD',
        referenceCode: 'UTILITY-001',
        note: 'Pay external counterparty for beneficiary user',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    expense: {
      summary: 'Expense',
      description: 'Record an expense-like transaction for operational history.',
      value: {
        type: 'EXPENSE',
        method: 'CASH',
        ownerUserId: 'user_owner_id',
        fromUserId: 'payer_user_id',
        toCounterpartyId: 'expense_counterparty_id',
        amount: '45',
        currency: 'USD',
        note: 'Office expense payment',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
    adjustment: {
      summary: 'Adjustment',
      description: 'Manual adjustment used to record a correction or bookkeeping-only event.',
      value: {
        type: 'ADJUSTMENT',
        method: 'MANUAL',
        ownerUserId: 'user_owner_id',
        amount: '25',
        currency: 'USD',
        note: 'Manual correction entry',
        occurredAt: '2026-04-03T12:00:00.000Z',
      },
    },
  },
}

export const listTransactionsOperation: ApiOperationOptions = {
  summary: 'List transactions',
  description:
    'Lists transactions with filters for users, accounts, counterparties, currency, type, method, and occurred-at date range.',
}

export const findTransactionOperation: ApiOperationOptions = {
  summary: 'Get transaction by ID',
  description: 'Fetches one transaction by id with related users, accounts, and counterparties.',
}

export const transactionIdParam: ApiParamOptions = {
  name: 'id',
  description: 'Transaction id',
}
