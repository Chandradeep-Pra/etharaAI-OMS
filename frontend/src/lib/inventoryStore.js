import { create } from 'zustand'
import { apiRequest, fetchInventoryData } from './api'
import { initialCustomerForm, initialOrderForm, initialProductForm } from './constants'
import { getDashboardFromState, getOrderPreview, makeTempId, reduceStock, snapshotState } from './optimistic'
import { applyData, withOptimistic } from './storeUtils'

const initialState = {
  activeTab: 'products',
  dashboard: null,
  products: [],
  customers: [],
  orders: [],
  productForm: initialProductForm,
  editingProductId: null,
  customerForm: initialCustomerForm,
  orderForm: initialOrderForm,
  loading: true,
  saving: false,
  error: '',
  notice: '',
}

export const useInventoryStore = create((set, get) => ({
  ...initialState,

  setActiveTab: (activeTab) => set({ activeTab }),
  setProductForm: (productForm) => set({ productForm }),
  setEditingProductId: (editingProductId) => set({ editingProductId }),
  setCustomerForm: (customerForm) => set({ customerForm }),
  setOrderForm: (orderForm) => set({ orderForm }),

  refreshData: async () => {
    set({ loading: true, error: '' })
    try {
      applyData(set, await fetchInventoryData())
    } catch (requestError) {
      set({ error: requestError.message })
    } finally {
      set({ loading: false })
    }
  },

  createProduct: async () => {
    const form = get().productForm
    const draft = { ...form, id: makeTempId('product'), price: Number(form.price), quantity: Number(form.quantity), isPending: true }
    await withOptimistic(set, get, {
      loading: 'Creating product...',
      success: 'Product created',
      rollback: 'Product was not saved',
      snapshot: snapshotState,
      optimistic: () => set((state) => {
        const next = { ...state, products: [draft, ...state.products] }
        return { products: next.products, productForm: initialProductForm, dashboard: getDashboardFromState(next) }
      }),
      request: () => apiRequest('/products', { method: 'POST', body: JSON.stringify({ ...form, price: Number(form.price), quantity: Number(form.quantity) }) }),
      commit: (saved) => set((state) => {
        const next = { ...state, products: state.products.map((product) => product.id === draft.id ? saved : product) }
        return { products: next.products, dashboard: getDashboardFromState(next) }
      }),
    })
  },

  updateProduct: async () => {
    const { editingProductId, productForm } = get()
    const payload = { ...productForm, price: Number(productForm.price), quantity: Number(productForm.quantity) }
    await withOptimistic(set, get, {
      loading: 'Updating product...',
      success: 'Product updated',
      rollback: 'Product update was rolled back',
      snapshot: snapshotState,
      optimistic: () => set((state) => {
        const products = state.products.map((item) => item.id === editingProductId ? { ...item, ...payload, isPending: true } : item)
        const next = { ...state, products }
        return { products, productForm: initialProductForm, editingProductId: null, dashboard: getDashboardFromState(next) }
      }),
      request: () => apiRequest(`/products/${editingProductId}`, { method: 'PUT', body: JSON.stringify(payload) }),
      commit: (saved) => set((state) => ({ products: state.products.map((item) => item.id === saved.id ? saved : item) })),
    })
  },

  createCustomer: async () => {
    const form = get().customerForm
    const draft = { ...form, id: makeTempId('customer'), isPending: true }
    await withOptimistic(set, get, {
      loading: 'Creating customer...',
      success: 'Customer created',
      rollback: 'Customer was rolled back',
      snapshot: snapshotState,
      optimistic: () => set((state) => {
        const next = { ...state, customers: [draft, ...state.customers] }
        return { customers: next.customers, customerForm: initialCustomerForm, dashboard: getDashboardFromState(next) }
      }),
      request: () => apiRequest('/customers', { method: 'POST', body: JSON.stringify(form) }),
      commit: (saved) => set((state) => {
        const next = { ...state, customers: state.customers.map((customer) => customer.id === draft.id ? saved : customer) }
        return { customers: next.customers, dashboard: getDashboardFromState(next) }
      }),
    })
  },

  createOrder: async () => {
    const state = get()
    const draft = getOrderPreview(state.orderForm, state.products)
    await withOptimistic(set, get, {
      loading: 'Creating order and reserving stock...',
      success: 'Order created',
      rollback: 'Order and stock changes were rolled back',
      snapshot: snapshotState,
      optimistic: () => set((current) => {
        const next = { ...current, orders: [draft, ...current.orders], products: reduceStock(current.products, draft.items) }
        return { orders: next.orders, products: next.products, orderForm: initialOrderForm, dashboard: getDashboardFromState(next) }
      }),
      request: () => apiRequest('/orders', { method: 'POST', body: JSON.stringify({ customer_id: Number(state.orderForm.customer_id), items: state.orderForm.items.map((item) => ({ product_id: Number(item.product_id), quantity: Number(item.quantity) })) }) }),
      commit: (saved) => set((current) => {
        const next = { ...current, orders: current.orders.map((order) => order.id === draft.id ? saved : order) }
        return { orders: next.orders, dashboard: getDashboardFromState(next) }
      }),
    })
  },

  removeResource: async (path, collection, id, success) => withOptimistic(set, get, {
    loading: 'Deleting...',
    success,
    rollback: 'Delete was rolled back',
    snapshot: snapshotState,
    optimistic: () => set((state) => {
      const next = { ...state, [collection]: state[collection].filter((item) => item.id !== id) }
      return { [collection]: next[collection], dashboard: getDashboardFromState(next) }
    }),
    request: () => apiRequest(path, { method: 'DELETE' }),
  }),
}))

export function useInventory() {
  return useInventoryStore((state) => ({
    ...state,
    maps: {
      products: new Map(state.products.map((product) => [String(product.id), product])),
      customers: new Map(state.customers.map((customer) => [String(customer.id), customer])),
    },
  }))
}
