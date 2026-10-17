import { Router, Response } from 'express'
import { PrismaClient, OfferStatus } from '@prisma/client'
import { createHash, randomUUID } from 'crypto'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// POST /api/transactions — submit a transaction and evaluate Perk eligibility
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { memberId, merchantId, lineItems } = req.body

  if (
    memberId === undefined ||
    merchantId === undefined ||
    !Array.isArray(lineItems) ||
    lineItems.length === 0
  ) {
    res.status(400).json({ error: 'memberId, merchantId, and lineItems are required' })
    return
  }

  // Compute gross_amount
  const grossAmount = (lineItems as { sku: string; quantity: number; unitPrice: number }[]).reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  const transactionId = randomUUID()

  try {
    let perkResult: {
      perk_applied: boolean
      discount_amount: number
      net_amount: number
      offer_id?: number
      perk_error?: string
    }

    try {
      const now = new Date()

      // Find Active Offers where merchantId matches exactly
      const activeOffers = await prisma.offer.findMany({
        where: {
          status: OfferStatus.ACTIVE,
          merchantId: merchantId as string,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      })

      // Among those, find one where at least one lineItem SKU is in the offer's skus list
      const lineItemSkus = (lineItems as { sku: string; quantity: number; unitPrice: number }[]).map(
        (item) => item.sku
      )

      const matchedOffer = activeOffers.find((offer) => {
        const offerSkus = offer.skus.split(',').map((s) => s.trim())
        return lineItemSkus.some((sku) => offerSkus.includes(sku))
      })

      if (matchedOffer) {
        const discountAmount = matchedOffer.discountAmount
        const netAmount = grossAmount - discountAmount
        const memberToken = createHash('sha256').update(memberId as string).digest('hex')

        // Determine matched SKUs and total quantity for the redemption record
        const offerSkus = matchedOffer.skus.split(',').map((s) => s.trim())
        const matchedItems = (lineItems as { sku: string; quantity: number; unitPrice: number }[]).filter(
          (item) => offerSkus.includes(item.sku)
        )
        const matchedSkus = matchedItems.map((item) => item.sku).join(',')
        const matchedQuantity = matchedItems.reduce((sum, item) => sum + item.quantity, 0)

        await prisma.redemption.create({
          data: {
            offerId: matchedOffer.id,
            transactionId,
            merchantId: merchantId as string,
            skus: matchedSkus,
            quantity: matchedQuantity,
            grossAmount,
            discountAmount,
            memberToken,
          },
        })

        perkResult = {
          perk_applied: true,
          discount_amount: discountAmount,
          net_amount: netAmount,
          offer_id: matchedOffer.id,
        }
      } else {
        perkResult = {
          perk_applied: false,
          discount_amount: 0,
          net_amount: grossAmount,
        }
      }
    } catch (evalError) {
      perkResult = {
        perk_applied: false,
        discount_amount: 0,
        net_amount: grossAmount,
        perk_error: evalError instanceof Error ? evalError.message : 'Perk evaluation error',
      }
    }

    res.status(200).json({
      transaction_id: transactionId,
      gross_amount: grossAmount,
      ...perkResult,
    })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
