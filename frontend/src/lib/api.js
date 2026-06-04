const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function getErrorMessage(error) {
  if (error?.error?.message) return error.error.message
  if (Array.isArray(error?.detail)) return error.detail.map((item) => item.msg).join(', ')
  if (typeof error?.detail === 'string') return error.detail
  return 'Request failed'
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(getErrorMessage(data))
  return data
}

export async function fetchInventoryData() {
  const [dashboard, products, customers, orders] = await Promise.all([
    apiRequest('/dashboard'),
    apiRequest('/products'),
    apiRequest('/customers'),
    apiRequest('/orders'),
  ])

  return {
    dashboard,
    products: products || [],
    customers: customers || [],
    orders: orders || [],
  }
}
