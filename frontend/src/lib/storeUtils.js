import toast from 'react-hot-toast'

export function applyData(set, data) {
  set({ dashboard: data.dashboard, products: data.products, customers: data.customers, orders: data.orders })
}

export async function withOptimistic(set, get, options) {
  const snapshot = options.snapshot(get())
  set({ saving: true, error: '', notice: '' })
  options.optimistic?.(snapshot)
  const toastId = toast.loading(options.loading)

  try {
    const result = await options.request()
    options.commit?.(result)
    set({ saving: false, notice: options.success })
    toast.success(options.success, { id: toastId })
    return result
  } catch (requestError) {
    set({ ...snapshot, saving: false, error: requestError.message })
    toast.error(`${options.rollback}. ${requestError.message}`, { id: toastId })
    return null
  }
}
