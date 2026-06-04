export function makeTempId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function getDashboardFromState(state) {
  return {
    total_products: state.products.length,
    total_customers: state.customers.length,
    total_orders: state.orders.length,
    low_stock_products: state.products.filter((product) => Number(product.quantity) <= 10),
  }
}

export function snapshotState(state) {
  return {
    dashboard: state.dashboard,
    products: state.products,
    customers: state.customers,
    orders: state.orders,
    productForm: state.productForm,
    editingProductId: state.editingProductId,
    customerForm: state.customerForm,
    orderForm: state.orderForm,
  }
}

export function getOrderPreview(form, products) {
  const productMap = new Map(products.map((product) => [String(product.id), product]))
  const items = form.items.map((item, index) => {
    const product = productMap.get(String(item.product_id))
    return {
      id: makeTempId(`item-${index}`),
      product_id: Number(item.product_id),
      quantity: Number(item.quantity),
      unit_price: Number(product?.price || 0),
    }
  })

  return {
    id: makeTempId('order'),
    customer_id: Number(form.customer_id),
    total_amount: items.reduce((total, item) => total + item.quantity * item.unit_price, 0),
    created_at: new Date().toISOString(),
    items,
    isPending: true,
  }
}

export function reduceStock(products, items) {
  return products.map((product) => {
    const ordered = items.find((item) => Number(item.product_id) === Number(product.id))
    if (!ordered) return product
    return { ...product, quantity: Number(product.quantity) - Number(ordered.quantity) }
  })
}
