import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { omitEmptyField } from '@/common/utils/zod'
import { TransactionType, TransferMethod } from '@/generated/prisma'

export const createTransactionSchema = z.object({
  type: z
    .enum(TransactionType)
    .describe('Business type of the transaction. This determines validation and balance effects.'),
  method: z
    .preprocess(omitEmptyField, z.enum(TransferMethod).optional())
    .describe('Operational transfer method such as CASH, BANK, WALLET, MANUAL, MIXED, or OTHER.'),
  ownerUserId: z
    .string()
    .trim()
    .min(1)
    .describe(
      'Owner context of the transaction. Usually the user whose relationship balances are affected.'
    ),
  fromUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Internal source user when the transaction originates from a user.'),
  toUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Internal target user when the transaction goes to a user.'),
  beneficiaryUserId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Internal beneficiary when the payment goes elsewhere for that user’s benefit.'),
  fromAccountId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Optional source institution account reference used for routing and analytics.'),
  toAccountId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Optional destination institution account reference used for routing and analytics.'),
  fromCounterpartyId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Optional external source counterparty.'),
  toCounterpartyId: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Optional external destination counterparty.'),
  amount: z.string().trim().min(1).describe('Positive decimal amount as a string.'),
  currency: z
    .string()
    .trim()
    .min(1)
    .describe('Currency code. It will be normalized by the service, for example USD or TRY.'),
  referenceCode: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe(
      'Optional external reference such as bank reference, receipt number, or tracking code.'
    ),
  note: z
    .preprocess(omitEmptyField, z.string().trim().min(1).optional())
    .describe('Optional human note that explains the business context of the transaction.'),
  occurredAt: z
    .string()
    .describe('Occurred-at timestamp in ISO-8601 format, for example 2026-04-03T12:00:00.000Z.'),
})

export class CreateTransactionDto extends createZodDto(createTransactionSchema) {}
