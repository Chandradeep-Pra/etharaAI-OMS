import { useMemo } from 'react'
import { Field, Panel } from './Controls'
import { DataTable } from './DataTable'
import { Tabs } from './Tabs'

export function CustomerSection({ inventory }) {
  const { customers, customerForm, setCustomerForm, saving, createCustomer, removeResource } = inventory
  const columns = useMemo(() => [
    { accessorKey: 'full_name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone', cell: ({ getValue }) => getValue() || '-' },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <button
          className="danger-button"
          type="button"
          onClick={() => removeResource(`/customers/${row.original.id}`, 'customers', row.original.id, 'Customer deleted')}
          disabled={saving || row.original.isPending}
        >
          Delete
        </button>
      ),
    },
  ], [removeResource, saving])

  function update(field, value) {
    setCustomerForm({ ...customerForm, [field]: value })
  }

  async function submitCustomer(event) {
    event.preventDefault()
    await createCustomer()
  }

  return (
    <>
      <Panel title="New Customer">
        <form className="form-grid" onSubmit={submitCustomer}>
          <Field label="Full name" value={customerForm.full_name} onChange={(value) => update('full_name', value)} required />
          <Field label="Email" type="email" value={customerForm.email} onChange={(value) => update('email', value)} required />
          <Field label="Phone" value={customerForm.phone} onChange={(value) => update('phone', value)} />
          <button className="primary-button" type="submit" disabled={saving}>Create Customer</button>
        </form>
      </Panel>

      <Panel title={<TableTitle inventory={inventory} />} wide>
        <DataTable
          columns={columns}
          data={customers}
          empty="No customers yet"
        />
      </Panel>
    </>
  )
}

function TableTitle({ inventory }) {
  return (
    <div className="table-panel-title">
      <span>Customers</span>
      <div className="desktop-tabs">
        <Tabs activeTab="customers" onChange={inventory.setActiveTab} />
      </div>
    </div>
  )
}
