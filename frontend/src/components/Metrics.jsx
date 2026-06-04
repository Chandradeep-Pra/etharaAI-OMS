function MetricCard({ label, value, tone }) {
  return (
    <article className={tone ? `metric ${tone}` : 'metric'}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

export function Metrics({ dashboard, products, customers, orders }) {
  return (
    <section className="metrics-grid">
      <MetricCard label="Products" value={dashboard?.total_products ?? products.length} />
      <MetricCard label="Customers" value={dashboard?.total_customers ?? customers.length} />
      <MetricCard label="Orders" value={dashboard?.total_orders ?? orders.length} />
      <MetricCard label="Low Stock" value={dashboard?.low_stock_products?.length ?? 0} tone="warning" />
    </section>
  )
}
