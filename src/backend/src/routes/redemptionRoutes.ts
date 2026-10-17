import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/redemptions/export — download all Redemption records as CSV
// Must be registered before /api/redemptions/:id to avoid shadowing
router.get('/export', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const redemptions = await prisma.redemption.findMany({
      orderBy: { createdAt: 'asc' },
    })

    const header = 'offer_id,transaction_id,merchant_id,timestamp,skus,quantity,gross_amount,discount_amount,member_token'
    const rows = redemptions.map((r) =>
      [
        r.offerId,
        r.transactionId,
        r.merchantId,
        r.createdAt.toISOString(),
        r.skus,
        r.quantity,
        r.grossAmount,
        r.discountAmount,
        r.memberToken,
      ].join(',')
    )

    const csv = [header, ...rows].join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="redemptions.csv"')
    res.status(200).send(csv)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/redemptions — list all Redemption records
router.get('/', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const redemptions = await prisma.redemption.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        offerId: true,
        transactionId: true,
        merchantId: true,
        skus: true,
        quantity: true,
        grossAmount: true,
        discountAmount: true,
        memberToken: true,
        createdAt: true,
      },
    })

    res.status(200).json(redemptions)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
