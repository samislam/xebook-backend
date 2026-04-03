import { map } from 'rxjs/operators'
import { Prisma } from '@/generated/prisma'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

function serializePrismaDecimals(value: unknown): unknown {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber()
  }

  if (Array.isArray(value)) {
    return value.map(serializePrismaDecimals)
  }

  if (value instanceof Date || value === null || value === undefined) {
    return value
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, serializePrismaDecimals(nestedValue)])
    )
  }

  return value
}

@Injectable()
export class PrismaDecimalInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => serializePrismaDecimals(data)))
  }
}
