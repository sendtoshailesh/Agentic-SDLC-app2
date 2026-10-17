export interface Redemption {
  id: number
  offerId: number
  transactionId: string
  merchantId: string
  skus: string
  quantity: number
  grossAmount: number
  discountAmount: number
  memberToken: string
  createdAt: string
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getRedemptions(): Promise<Redemption[]> {
  const res = await fetch('/api/redemptions', { headers: getAuthHeaders() })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Failed to fetch redemptions')
  }
  return res.json()
}

export async function exportRedemptionsCSV(): Promise<void> {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/redemptions/export', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) {
    throw new Error('Failed to export redemptions')
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'redemptions.csv'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
