import { useState } from 'react'
import { createOffer, CreateOfferPayload, Offer } from '../offerService'

interface Props {
  onCreated: (offer: Offer) => void
  onClose: () => void
}

export default function CreateOfferForm({ onCreated, onClose }: Props) {
  const [merchantId, setMerchantId] = useState('')
  const [skus, setSkus] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('INACTIVE')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const payload: CreateOfferPayload = {
        merchantId,
        skus,
        discountAmount: parseFloat(discountAmount),
        startDate,
        endDate,
        status,
      }
      const created = await createOffer(payload)
      onCreated(created)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: '2rem',
          width: 480,
          maxWidth: '95vw',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Create Offer</h2>
        <form data-testid="offer-form" onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Merchant ID</label>
            <input
              data-testid="offer-merchant-input"
              type="text"
              value={merchantId}
              onChange={e => setMerchantId(e.target.value)}
              required
              style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>SKUs (comma-separated)</label>
            <input
              data-testid="offer-sku-input"
              type="text"
              value={skus}
              onChange={e => setSkus(e.target.value)}
              required
              style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Discount Amount</label>
            <input
              data-testid="offer-discount-input"
              type="number"
              min="0"
              step="0.01"
              value={discountAmount}
              onChange={e => setDiscountAmount(e.target.value)}
              required
              style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Start Date</label>
            <input
              data-testid="offer-start-date-input"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>End Date</label>
            <input
              data-testid="offer-end-date-input"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              required
              style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Status</label>
            <select
              data-testid="offer-status-select"
              value={status}
              onChange={e => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
              style={{ width: '100%', padding: '6px 8px', boxSizing: 'border-box' }}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {error && (
            <p style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              data-testid="offer-submit-button"
              type="submit"
              disabled={submitting}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Creating…' : 'Create Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
