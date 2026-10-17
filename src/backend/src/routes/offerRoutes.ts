import { Router, Response } from 'express'
import { PrismaClient, OfferStatus } from '@prisma/client'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// POST /api/offers — create a new Offer
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, startDate, endDate, merchantId, skus, discountAmount } = req.body

  if (
    status === undefined ||
    startDate === undefined ||
    endDate === undefined ||
    merchantId === undefined ||
    skus === undefined ||
    discountAmount === undefined
  ) {
    res.status(400).json({ error: 'status, startDate, endDate, merchantId, skus, and discountAmount are required' })
    return
  }

  if (!Object.values(OfferStatus).includes(status as OfferStatus)) {
    res.status(400).json({ error: 'status must be ACTIVE or INACTIVE' })
    return
  }

  try {
    const offer = await prisma.offer.create({
      data: {
        status: status as OfferStatus,
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        merchantId: merchantId as string,
        skus: skus as string,
        discountAmount: discountAmount as number,
      },
    })

    res.status(201).json({
      id: offer.id,
      status: offer.status,
      startDate: offer.startDate,
      endDate: offer.endDate,
      merchantId: offer.merchantId,
      skus: offer.skus,
      discountAmount: offer.discountAmount,
      createdAt: offer.createdAt,
    })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/offers — list all Offers
router.get('/', authenticate, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
        merchantId: true,
        skus: true,
        discountAmount: true,
        createdAt: true,
      },
    })

    res.status(200).json(offers)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/offers/:id — update an Offer's status
router.patch('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10)
  const { status } = req.body

  if (!status || !Object.values(OfferStatus).includes(status as OfferStatus)) {
    res.status(400).json({ error: 'status must be ACTIVE or INACTIVE' })
    return
  }

  try {
    const existing = await prisma.offer.findUnique({ where: { id } })
    if (!existing) {
      res.status(404).json({ error: 'Offer not found' })
      return
    }

    const offer = await prisma.offer.update({
      where: { id },
      data: { status: status as OfferStatus },
    })

    res.status(200).json({ id: offer.id, status: offer.status })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
