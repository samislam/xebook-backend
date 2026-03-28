import { BadRequestException } from '@nestjs/common'
import { Prisma } from '@/generated/prisma'

export function toDecimal(value: Prisma.Decimal | string | number, fieldName = 'amount') {
  try {
    return new Prisma.Decimal(value)
  } catch {
    throw new BadRequestException(`${fieldName} must be a valid decimal value`)
  }
}

export function assertDecimalPositive(value: Prisma.Decimal, fieldName = 'amount') {
  if (value.lte(0)) {
    throw new BadRequestException(`${fieldName} must be greater than zero`)
  }
}
