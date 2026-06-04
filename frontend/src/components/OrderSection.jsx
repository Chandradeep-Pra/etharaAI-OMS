import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../lib/format'
import { Field, Panel, SelectField } from './Controls'
import { DataTable } from './DataTable'
import { Tabs } from './Tabs'

export function OrderSection({ inventory }) {
  const { products, customers, orders, orderForm, setOrderForm, maps, saving, createOrder, removeResource } = inventory
  const orderRows = useMemo(() => orders.map((order) => {
    const items = order.items || []
    return {
      ...order,
      customerName: maps.customers.get(String(order.customer_id))?.full_name || `Customer ${order.customer_id}`,
      itemSummary: items.map((item) => {
        const product = maps.products.get(String(item.product_id))
        return `${product?.name || `Product ${item.product_id}`} x ${item.quantity}`
      }).join(', '),
      itemCount: items.reduce((total, item) => total + Number(item.quantity || 0), 0),
    }
  }), [orders, maps])
  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'Order' },
    { accessorKey: 'customerName', header: 'Customer' },
    { accessorKey: 'itemSummary', header: 'Items' },
    { accessorKey: 'itemCount', header: 'Qty' },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ getValue }) => formatMoney(getValue()) },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="action-cluster">
          <Link className="secondary-button table-link" to={`/orders/${row.original.id}`}>Details</Link>
          <button
            className="danger-button"
            type="button"
            onClick={() => removeResource(`/orders/${row.original.id}`, 'orders', row.original.id, 'Order deleted')}
            disabled={saving || row.original.isPending}
          >
            Delete
          </button>
        </div>
      ),
    },
  ], [removeResource, saving])

  function updateItem(index, field, value) {
    setOrderForm({ ...orderForm, items: orderForm.items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )) })
  }

  function addItem() {
    setOrderForm({ ...orderForm, items: [...orderForm.items, { product_id: '', quantity: 1 }] })
  }

  function removeItem(index) {
    if (orderForm.items.length === 1) return
    setOrderForm({ ...orderForm, items: orderForm.items.filter((_, itemIndex) => itemIndex !== index) })
  }

  async function submitOrder(event) {
    event.preventDefault()
    await createOrder()
  }

  return (
    <>
      <Panel title="New Order">
        <form className="order-form" onSubmit={submitOrder}>
          <SelectField label="Customer" value={orderForm.customer_id} onChange={(value) => setOrderForm({ ...orderForm, customer_id: value })} required>
            <option value="">Select customer</option>
            {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.full_name}</option>)}
          </SelectField>
          <OrderItems products={products} items={orderForm.items} onChange={updateItem} onRemove={removeItem} />
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={addItem}>Add Item</button>
            <button className="primary-button" type="submit" disabled={saving || !products.length || !customers.length}>Create Order</button>
          </div>
        </form>
      </Panel>
      <Panel title={<TableTitle inventory={inventory} />} wide>
        <DataTable columns={columns} data={orderRows} empty="No orders yet" />
      </Panel>
    </>
  )
}

function TableTitle({ inventory }) {
  return (
    <div className="table-panel-title">
      <span>Recent Orders</span>
      <div className="desktop-tabs">
        <Tabs activeTab="orders" onChange={inventory.setActiveTab} />
      </div>
    </div>
  )
}

function OrderItems({ products, items, onChange, onRemove }) {
  return <div className="line-items">{items.map((item, index) => (
    <div className="line-item" key={`${index}-${item.product_id}`}>
      <SelectField label="Product" value={item.product_id} onChange={(value) => onChange(index, 'product_id', value)} required>
        <option value="">Select product</option>
        {products.map((product) => <option key={product.id} value={product.id}>{product.name} - {product.quantity} in stock</option>)}
      </SelectField>
      <Field label="Qty" type="number" min="1" step="1" value={item.quantity} onChange={(value) => onChange(index, 'quantity', value)} required />
      <button className="icon-button small" type="button" onClick={() => onRemove(index)} title="Remove item">x</button>
    </div>
  ))}</div>
}
