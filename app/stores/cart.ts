import { defineStore } from 'pinia'

export interface CartItem {
  product_id: number
  slug: string
  name: string
  price: number
  image: string | null
  stock: number
  qty: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

  function add(product: Omit<CartItem, 'qty'>, qty = 1) {
    const existing = items.value.find((i) => i.product_id === product.product_id)
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock)
    } else {
      items.value.push({ ...product, qty: Math.min(qty, product.stock) })
    }
  }

  function setQty(productId: number, qty: number) {
    const item = items.value.find((i) => i.product_id === productId)
    if (!item) return
    item.qty = Math.max(1, Math.min(qty, item.stock))
  }

  function remove(productId: number) {
    items.value = items.value.filter((i) => i.product_id !== productId)
  }

  function clear() {
    items.value = []
  }

  function load() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem('cart')
      if (raw) items.value = JSON.parse(raw)
    } catch {
      items.value = []
    }
  }

  if (import.meta.client) {
    watch(
      items,
      (val) => localStorage.setItem('cart', JSON.stringify(val)),
      { deep: true }
    )
  }

  return { items, count, subtotal, add, setQty, remove, clear, load }
})
