export const initialProductForm = {
  name: '',
  sku: '',
  price: '',
  quantity: '',
}

export const initialCustomerForm = {
  full_name: '',
  email: '',
  phone: '',
}

export const initialOrderForm = {
  customer_id: '',
  items: [{ product_id: '', quantity: 1 }],
}

export const tabs = [
  { id: 'products', label: 'Products' },
  { id: 'customers', label: 'Customers' },
  { id: 'orders', label: 'Orders' },
]
