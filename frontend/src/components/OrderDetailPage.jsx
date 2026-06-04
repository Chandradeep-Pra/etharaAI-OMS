import { Link, useParams } from 'react-router-dom'
import { formatMoney } from '../lib/format'

function formatDate(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function OrderDetailPage({ inventory }) {
  const { orderId } = useParams()
  const { loading, orders, maps } = inventory
  const order = orders.find((item) => String(item.id) === String(orderId))

  if (loading) return <main className="shell"><div className="loading-panel">Loading order...</div></main>
  if (!order) return <MissingOrder />

  const customer = maps.customers.get(String(order.customer_id))
  const relatedOrders = orders.filter((item) => item.customer_id === order.customer_id && item.id !== order.id)

  return (
    <main className="shell">
      <header className="detail-topbar">
        <div><Link to="/" className="back-link">Back to orders</Link><h1>Order #{order.id}</h1></div>
        <strong>{formatMoney(order.total_amount)}</strong>
      </header>
      <section className="detail-layout">
        <OrderMainCard order={order} customer={customer} maps={maps} />
        <RelatedOrders orders={relatedOrders} />
      </section>
    </main>
  )
}

function MissingOrder() {
  return <main className="shell"><div className="loading-panel">Order not found. <Link to="/">Return home</Link></div></main>
}

function OrderMainCard({ order, customer, maps }) {
  return (
    <section className="detail-card">
      <div className="detail-meta">
        <Info label="Customer" value={customer?.full_name || `Customer ${order.customer_id}`} />
        <Info label="Email" value={customer?.email || '-'} />
        <Info label="Phone" value={customer?.phone || '-'} />
        <Info label="Created" value={formatDate(order.created_at)} />
      </div>
      <h2>Items</h2>
      <div className="detail-items">
        {(order.items || []).map((item) => {
          const product = maps.products.get(String(item.product_id))
          return (
            <div className="detail-item" key={item.id || `${order.id}-${item.product_id}`}>
              <div><strong>{product?.name || `Product ${item.product_id}`}</strong><span>{product?.sku || '-'}</span></div>
              <span>{item.quantity} x {formatMoney(item.unit_price)}</span>
              <strong>{formatMoney(Number(item.quantity) * Number(item.unit_price))}</strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Info({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}

function RelatedOrders({ orders }) {
  return (
    <aside className="side-card">
      <h2>Other Orders</h2>
      {orders.length ? orders.map((order) => (
        <Link className="related-order" to={`/orders/${order.id}`} key={order.id}>
          <span>Order #{order.id}</span><strong>{formatMoney(order.total_amount)}</strong><small>{formatDate(order.created_at)}</small>
        </Link>
      )) : <p>No other orders for this customer.</p>}
    </aside>
  )
}
