export interface Offer {
  id: number
  merchantId: string
  skus: string
  discountAmount: number
  status: 'ACTIVE' | 'INACTIVE'
  startDate: string
  endDate: string
  createdAt: string
}

export interface CreateOfferPayload {
  merchantId: string
  skus: string
  discountAmount: number
  status: 'ACTIVE' | 'INACTIVE'
  startDate: string
  endDate: string
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function getOffers(): Promise<Offer[]> {
  const res = await fetch('/api/offers', { headers: getAuthHeaders() })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Failed to fetch offers')
  }
  return res.json()
}

export async function createOffer(payload: CreateOfferPayload): Promise<Offer> {
  const res = await fetch('/api/offers', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Failed to create offer')
  }
  return res.json()
}

export async function toggleOfferStatus(
  id: number,
  newStatus: 'ACTIVE' | 'INACTIVE',
): Promise<{ id: number; status: 'ACTIVE' | 'INACTIVE' }> {
  const res = await fetch(`/api/offers/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: newStatus }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Failed to update offer status')
  }
  return res.json()
}
