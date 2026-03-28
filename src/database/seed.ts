import { hash } from 'bcryptjs'
import { PrismaClient } from '@/generated/prisma'
import { runSeeders } from '@/lib/prisma/run-seeders'

const prisma = new PrismaClient()

async function main() {
  await runSeeders(prisma, [
    async (tx) => {
      const passwordHash = await hash('ChangeMe123!', 12)
      await tx.user.upsert({
        where: { username: 'admin' },
        update: {
          name: 'Admin',
          isActive: true,
        },
        create: {
          name: 'Admin',
          username: 'admin',
          passwordHash,
          isActive: true,
        },
      })
    },
  ])
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
