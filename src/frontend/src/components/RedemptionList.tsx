import { useState, useEffect } from 'react'
import { getRedemptions, exportRedemptionsCSV, Redemption } from '../redemptionService'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export default function RedemptionList() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    getRedemptions()
      .then(setRedemptions)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load redemptions'))
      .finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      await exportRedemptionsCSV()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export redemptions')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return <p>Loading redemptions…</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Redemptions</h1>
        <button
          data-testid="export-csv-button"
          onClick={handleExport}
          disabled={exporting}
          style={{
            padding: '8px 16px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: exporting ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {error && (
        <p style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>
      )}

      <div data-testid="redemption-list" style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>Offer ID</th>
              <th style={{ padding: '8px 12px' }}>Transaction ID</th>
              <th style={{ padding: '8px 12px' }}>Merchant ID</th>
              <th style={{ padding: '8px 12px' }}>Timestamp</th>
              <th style={{ padding: '8px 12px' }}>SKUs</th>
              <th style={{ padding: '8px 12px' }}>Quantity</th>
              <th style={{ padding: '8px 12px' }}>Gross Amount</th>
              <th style={{ padding: '8px 12px' }}>Discount Amount</th>
              <th style={{ padding: '8px 12px' }}>Member Token</th>
            </tr>
          </thead>
          <tbody>
            {redemptions.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '16px 12px', textAlign: 'center', color: '#6b7280' }}>
                  No redemptions found
                </td>
              </tr>
            ) : (
              redemptions.map(r => (
                <tr
                  key={r.id}
                  data-testid="redemption-item"
                  style={{ borderBottom: '1px solid #e5e7eb' }}
                >
                  <td style={{ padding: '10px 12px' }}>{r.offerId}</td>
                  <td style={{ padding: '10px 12px' }}>{r.transactionId}</td>
                  <td style={{ padding: '10px 12px' }}>{r.merchantId}</td>
                  <td style={{ padding: '10px 12px' }}>{formatDate(r.createdAt)}</td>
                  <td style={{ padding: '10px 12px' }}>{r.skus}</td>
                  <td style={{ padding: '10px 12px' }}>{r.quantity}</td>
                  <td style={{ padding: '10px 12px' }}>${r.grossAmount.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px' }}>${r.discountAmount.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px' }}>{r.memberToken}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
