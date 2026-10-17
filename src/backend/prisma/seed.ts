import { PrismaClient, OfferStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  })

  await prisma.offer.createMany({
    data: [
      {
        status: OfferStatus.ACTIVE,
        merchantId: 'MERCHANT_001',
        skus: 'SKU_A,SKU_B',
        discountAmount: 5.00,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
      {
        status: OfferStatus.ACTIVE,
        merchantId: 'MERCHANT_002',
        skus: 'SKU_C',
        discountAmount: 10.00,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
      {
        status: OfferStatus.INACTIVE,
        merchantId: 'MERCHANT_001',
        skus: 'SKU_D',
        discountAmount: 3.00,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30'),
      },
      {
        status: OfferStatus.ACTIVE,
        merchantId: 'MERCHANT_003',
        skus: 'SKU_E',
        discountAmount: 7.50,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
      },
      {
        status: OfferStatus.INACTIVE,
        merchantId: 'MERCHANT_002',
        skus: 'SKU_F',
        discountAmount: 2.00,
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-12-31'),
      },
    ],
  })

  await prisma.redemption.createMany({
    data: [
      {
        offerId: 1,
        transactionId: 'txn-001',
        merchantId: 'MERCHANT_001',
        skus: 'SKU_A',
        quantity: 2,
        grossAmount: 50.00,
        discountAmount: 5.00,
        memberToken: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      },
      {
        offerId: 2,
        transactionId: 'txn-002',
        merchantId: 'MERCHANT_002',
        skus: 'SKU_C',
        quantity: 1,
        grossAmount: 80.00,
        discountAmount: 10.00,
        memberToken: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3',
      },
      {
        offerId: 4,
        transactionId: 'txn-003',
        merchantId: 'MERCHANT_003',
        skus: 'SKU_E',
        quantity: 3,
        grossAmount: 120.00,
        discountAmount: 7.50,
        memberToken: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      },
    ],
  })

  console.log('Seed complete — test user, offer, and redemption data ready')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
