import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { RateSource } from '@/generated/prisma'
import { omitEmptyField } from '@/common/utils/zod'

export const createRateSnapshotSchema = z.object({
  baseCurrency: z.string().trim().min(1),
  quoteCurrency: z.string().trim().min(1),
  rate: z.string().trim().min(1),
  source: z.preprocess(omitEmptyField, z.enum(RateSource).optional()),
  recorderUserId: z.preprocess(omitEmptyField, z.string().trim().min(1).optional()),
  note: z.preprocess(omitEmptyField, z.string().trim().optional()),
  capturedAt: z.string(),
})

export class CreateRateSnapshotDto extends createZodDto(createRateSnapshotSchema) {}
