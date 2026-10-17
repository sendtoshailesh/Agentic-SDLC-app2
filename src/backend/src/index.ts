import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import offerRoutes from './routes/offerRoutes'
import transactionRoutes from './routes/transactionRoutes'
import redemptionRoutes from './routes/redemptionRoutes'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Pre-built routes
app.use('/api/auth', authRoutes)

// Feature routes are added by [BACKEND] Issues during the workshop
app.use('/api/offers', offerRoutes)
app.use('/api/transactions', transactionRoutes)
// /api/redemptions/export is registered inside redemptionRoutes before any /:id route
app.use('/api/redemptions', redemptionRoutes)

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})

export default app
