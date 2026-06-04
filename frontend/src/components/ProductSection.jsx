import { useMemo } from 'react'
import { formatMoney } from '../lib/format'
import { Field, Panel } from './Controls'
import { DataTable } from './DataTable'
import { Tabs } from './Tabs'

function StockBadge({ quantity }) {
  const className = quantity <= 5 ? 'stock-badge low' : quantity <= 10 ? 'stock-badge watch' : 'stock-badge'
  return <span className={className}>{quantity}</span>
}

export function ProductSection({ inventory }) {
  const {
    products,
    productForm,
    editingProductId,
    setProductForm,
    setEditingProductId,
    saving,
    createProduct,
    updateProduct,
    removeResource,
  } = inventory
  const columns = useMemo(() => [
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'price', header: 'Price', cell: ({ getValue }) => formatMoney(getValue()) },
    { accessorKey: 'quantity', header: 'Stock', cell: ({ getValue }) => <StockBadge quantity={getValue()} /> },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setProductForm({
              name: row.original.name,
              sku: row.original.sku,
              price: row.original.price,
              quantity: row.original.quantity,
            })
            setEditingProductId(row.original.id)
          }}
          disabled={saving || row.original.isPending}
        >
          Edit
        </button>
      ),
    },
    {
      id: 'delete',
      header: '',
      cell: ({ row }) => (
        <button
          className="danger-button"
          type="button"
          onClick={() => removeResource(`/products/${row.original.id}`, 'products', row.original.id, 'Product deleted')}
          disabled={saving || row.original.isPending}
        >
          Delete
        </button>
      ),
    },
  ], [removeResource, saving, setEditingProductId, setProductForm])

  function update(field, value) {
    setProductForm({ ...productForm, [field]: value })
  }

  async function submitProduct(event) {
    event.preventDefault()
    if (editingProductId) await updateProduct()
    else await createProduct()
  }

  return (
    <>
      <Panel title={editingProductId ? 'Update Product' : 'New Product'}>
        <form className="form-grid" onSubmit={submitProduct}>
          <Field label="Name" value={productForm.name} onChange={(value) => update('name', value)} required />
          <Field label="SKU" value={productForm.sku} onChange={(value) => update('sku', value)} required />
          <Field label="Price" type="number" min="0" step="0.01" value={productForm.price} onChange={(value) => update('price', value)} required />
          <Field label="Quantity" type="number" min="0" step="1" value={productForm.quantity} onChange={(value) => update('quantity', value)} required />
          <button className="primary-button" type="submit" disabled={saving}>
            {editingProductId ? 'Update Product' : 'Create Product'}
          </button>
          {editingProductId ? (
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setProductForm({ name: '', sku: '', price: '', quantity: '' })
                setEditingProductId(null)
              }}
            >
              Cancel
            </button>
          ) : null}
        </form>
      </Panel>

      <Panel title={<TableTitle activeTab="products" inventory={inventory} />} wide>
        <DataTable
          columns={columns}
          data={products}
          empty="No products yet"
        />
      </Panel>
    </>
  )
}

function TableTitle({ activeTab, inventory }) {
  return (
    <div className="table-panel-title">
      <span>Inventory</span>
      <div className="desktop-tabs">
        <Tabs activeTab={activeTab} onChange={inventory.setActiveTab} />
      </div>
    </div>
  )
}
