import { useState, useEffect } from 'react'
import { getOffers, toggleOfferStatus, Offer } from '../offerService'
import CreateOfferForm from './CreateOfferForm'

function StatusBadge({ status }: { status: 'ACTIVE' | 'INACTIVE' }) {
  const isActive = status === 'ACTIVE'
  return (
    <span
      data-testid="offer-status-badge"
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: '0.8rem',
        fontWeight: 600,
        backgroundColor: isActive ? '#d1fae5' : '#fee2e2',
        color: isActive ? '#065f46' : '#991b1b',
      }}
    >
      {status}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString()
}

export default function OfferList() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    getOffers()
      .then(setOffers)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load offers'))
      .finally(() => setLoading(false))
  }, [])

  const handleCreated = (offer: Offer) => {
    setOffers(prev => [offer, ...prev])
    setShowForm(false)
  }

  const handleToggleStatus = async (offer: Offer) => {
    const newStatus = offer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    setToggling(offer.id)
    try {
      const updated = await toggleOfferStatus(offer.id, newStatus)
      setOffers(prev =>
        prev.map(o => (o.id === updated.id ? { ...o, status: updated.status } : o)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle status')
    } finally {
      setToggling(null)
    }
  }

  if (loading) {
    return <p>Loading offers…</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Offers</h1>
        <button
          data-testid="create-offer-button"
          onClick={() => setShowForm(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          + Create Offer
        </button>
      </div>

      {error && (
        <p style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>
      )}

      <div data-testid="offer-list" style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>ID</th>
              <th style={{ padding: '8px 12px' }}>Merchant ID</th>
              <th style={{ padding: '8px 12px' }}>SKUs</th>
              <th style={{ padding: '8px 12px' }}>Discount</th>
              <th style={{ padding: '8px 12px' }}>Status</th>
              <th style={{ padding: '8px 12px' }}>Start Date</th>
              <th style={{ padding: '8px 12px' }}>End Date</th>
              <th style={{ padding: '8px 12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '16px 12px', textAlign: 'center', color: '#6b7280' }}>
                  No offers found
                </td>
              </tr>
            ) : (
              offers.map(offer => (
                <tr
                  key={offer.id}
                  data-testid="offer-item"
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                  <td style={{ padding: '10px 12px' }}>{offer.id}</td>
                  <td style={{ padding: '10px 12px' }}>{offer.merchantId}</td>
                  <td style={{ padding: '10px 12px' }}>{offer.skus}</td>
                  <td style={{ padding: '10px 12px' }}>${offer.discountAmount.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <StatusBadge status={offer.status} />
                  </td>
                  <td style={{ padding: '10px 12px' }}>{formatDate(offer.startDate)}</td>
                  <td style={{ padding: '10px 12px' }}>{formatDate(offer.endDate)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button
                      data-testid="toggle-status-button"
                      onClick={() => handleToggleStatus(offer)}
                      disabled={toggling === offer.id}
                      style={{
                        padding: '4px 10px',
                        cursor: toggling === offer.id ? 'not-allowed' : 'pointer',
                        border: '1px solid #d1d5db',
                        borderRadius: 4,
                        backgroundColor: '#f9fafb',
                      }}
                    >
                      {toggling === offer.id
                        ? '…'
                        : offer.status === 'ACTIVE'
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <CreateOfferForm
          onCreated={handleCreated}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
