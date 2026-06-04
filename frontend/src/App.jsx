import { useEffect, useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CustomerSection } from './components/CustomerSection'
import { LowStockList } from './components/LowStockList'
import { Metrics } from './components/Metrics'
import { OrderDetailPage } from './components/OrderDetailPage'
import { OrderSection } from './components/OrderSection'
import { ProductSection } from './components/ProductSection'
import { useInventoryStore } from './lib/inventoryStore'

function App() {
  const inventory = useInventoryStore()
  const { products, customers, refreshData } = inventory
  const maps = useMemo(() => ({
    products: new Map(products.map((product) => [String(product.id), product])),
    customers: new Map(customers.map((customer) => [String(customer.id), customer])),
  }), [products, customers])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const inventoryContext = { ...inventory, maps }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3200 }} />
      <Routes>
        <Route path="/" element={<InventoryHome inventory={inventoryContext} />} />
        <Route path="/orders/:orderId" element={<OrderDetailPage inventory={inventoryContext} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function InventoryHome({ inventory }) {
  const {
    activeTab,
    dashboard,
    loading,
    products,
    customers,
    orders,
    refreshData,
  } = inventory

  return (
    <main className="shell">
      <header className="topbar">
        <p className="eyebrow">OMS</p>
        <button className="ghost-button" type="button" onClick={refreshData} disabled={loading}>Refresh</button>
      </header>
      <Metrics dashboard={dashboard} products={products} customers={customers} orders={orders} />
      <LowStockList products={dashboard?.low_stock_products} />
      {loading ? <div className="loading-panel">Loading inventory data...</div> : (
        <section className="workspace">
          {activeTab === 'products' && <ProductSection inventory={inventory} />}
          {activeTab === 'customers' && <CustomerSection inventory={inventory} />}
          {activeTab === 'orders' && <OrderSection inventory={inventory} />}
        </section>
      )}
    </main>
  )
}

export default App
