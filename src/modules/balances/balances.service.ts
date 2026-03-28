import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@/generated/prisma'
import { normalizeCurrency } from '@/common/utils/currency'

type DbClient = Prisma.TransactionClient | PrismaClient

@Injectable()
export class BalancesService {
  async adjustHeldBalance(
    db: DbClient,
    ownerUserId: string,
    holderUserId: string,
    currency: string,
    delta: Prisma.Decimal
  ) {
    if (ownerUserId === holderUserId) {
      throw new BadRequestException('Owner and holder must be different users')
    }

    const normalizedCurrency = normalizeCurrency(currency)
    const existing = await db.heldBalance.findUnique({
      where: {
        ownerUserId_holderUserId_currency: {
          ownerUserId,
          holderUserId,
          currency: normalizedCurrency,
        },
      },
    })

    const nextAmount = (existing?.amount ?? new Prisma.Decimal(0)).plus(delta)
    if (nextAmount.lt(0)) {
      throw new BadRequestException('Held balance cannot become negative')
    }

    return db.heldBalance.upsert({
      where: {
        ownerUserId_holderUserId_currency: {
          ownerUserId,
          holderUserId,
          currency: normalizedCurrency,
        },
      },
      update: { amount: nextAmount },
      create: {
        ownerUserId,
        holderUserId,
        currency: normalizedCurrency,
        amount: nextAmount,
      },
    })
  }

  async adjustDebtBalance(
    db: DbClient,
    debtorUserId: string,
    creditorUserId: string,
    currency: string,
    delta: Prisma.Decimal
  ) {
    if (debtorUserId === creditorUserId) {
      throw new BadRequestException('Debtor and creditor must be different users')
    }

    const normalizedCurrency = normalizeCurrency(currency)
    const existing = await db.debtBalance.findUnique({
      where: {
        debtorUserId_creditorUserId_currency: {
          debtorUserId,
          creditorUserId,
          currency: normalizedCurrency,
        },
      },
    })

    const nextAmount = (existing?.amount ?? new Prisma.Decimal(0)).plus(delta)
    if (nextAmount.lt(0)) {
      throw new BadRequestException('Debt balance cannot become negative')
    }

    return db.debtBalance.upsert({
      where: {
        debtorUserId_creditorUserId_currency: {
          debtorUserId,
          creditorUserId,
          currency: normalizedCurrency,
        },
      },
      update: { amount: nextAmount },
      create: {
        debtorUserId,
        creditorUserId,
        currency: normalizedCurrency,
        amount: nextAmount,
      },
    })
  }
}
