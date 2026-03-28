import { PrismaClient } from '@/generated/prisma'
import { runSeeders } from '@/lib/prisma/run-seeders'
import { rootAccountSeeder } from '@/database/seeders/root-account.seeder'

const prisma = new PrismaClient()

async function main() {
  await runSeeders(prisma, [rootAccountSeeder])
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
