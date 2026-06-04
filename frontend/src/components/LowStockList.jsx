export function LowStockList({ products }) {
  if (!products?.length) return null

  return (
    <section className="low-stock-strip">
      <strong>Low stock</strong>
      <div>
        {products.slice(0, 6).map((product) => (
          <span key={product.id}>{product.name} · {product.quantity}</span>
        ))}
      </div>
    </section>
  )
}
