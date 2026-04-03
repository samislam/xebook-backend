import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { SettlementKind, SettlementStatus } from '@/generated/prisma'
import { paginationQuerySchema } from '@/common/dtos/pagination-query.dto'
import { omitEmptyField } from '@/common/utils/zod'

export const listOrderSettlementsQuerySchema = paginationQuerySchema.extend({
  orderId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  kind: z.preprocess(omitEmptyField, z.enum(SettlementKind).optional()),
  status: z.preprocess(omitEmptyField, z.enum(SettlementStatus).optional()),
  payerUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  payeeUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  beneficiaryUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  toCounterpartyId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  currency: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
})

export class ListOrderSettlementsQueryDto extends createZodDto(listOrderSettlementsQuerySchema) {}
