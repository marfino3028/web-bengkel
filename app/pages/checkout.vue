<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const cart = useCartStore()
const auth = useAuthStore()
const { rupiah } = useFormat()

const form = reactive({
  fulfillment: 'pickup' as 'pickup' | 'delivery',
  shipping_address: '',
  payment_method: 'transfer' as 'cash' | 'transfer',
  notes: '',
})

const loading = ref(false)
const errorMsg = ref('')

onMounted(() => {
  if (!cart.items.length) navigateTo('/keranjang')
})

async function submit() {
  errorMsg.value = ''
  if (form.fulfillment === 'delivery' && !form.shipping_address.trim()) {
    errorMsg.value = 'Alamat pengiriman wajib diisi.'
    return
  }
  loading.value = true
  try {
    const res = await useApi()<{ data: { order_code: string } }>('/orders', {
      method: 'POST',
      body: {
        items: cart.items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
        fulfillment: form.fulfillment,
        shipping_address: form.fulfillment === 'delivery' ? form.shipping_address : null,
        payment_method: form.payment_method,
        notes: form.notes || null,
      },
    })
    cart.clear()
    await navigateTo(`/akun/pesanan/${res.data.order_code}`)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal membuat pesanan. Stok mungkin tidak mencukupi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container-app max-w-4xl py-8">
    <h1 class="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Checkout</h1>

    <form class="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]" @submit.prevent="submit">
      <div class="space-y-5">
        <div class="card p-5">
          <h2 class="font-display font-semibold text-slate-900">Data Pemesan</h2>
          <p class="mt-2 text-sm text-slate-600">{{ auth.user?.name }} · {{ auth.user?.phone || auth.user?.email }}</p>
        </div>

        <div class="card p-5">
          <h2 class="font-display font-semibold text-slate-900">Metode Pengambilan</h2>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label class="flex cursor-pointer items-center gap-3 rounded-xl border p-3" :class="form.fulfillment === 'pickup' ? 'border-primary-500 bg-primary-50' : 'border-slate-200'">
              <input v-model="form.fulfillment" type="radio" value="pickup" class="accent-primary-600">
              <span><span class="block text-sm font-semibold">Ambil di Bengkel</span><span class="text-xs text-slate-500">Gratis</span></span>
            </label>
            <label class="flex cursor-pointer items-center gap-3 rounded-xl border p-3" :class="form.fulfillment === 'delivery' ? 'border-primary-500 bg-primary-50' : 'border-slate-200'">
              <input v-model="form.fulfillment" type="radio" value="delivery" class="accent-primary-600">
              <span><span class="block text-sm font-semibold">Diantar</span><span class="text-xs text-slate-500">Sesuai alamat</span></span>
            </label>
          </div>
          <div v-if="form.fulfillment === 'delivery'" class="mt-4">
            <label class="label">Alamat Pengiriman</label>
            <textarea v-model="form.shipping_address" rows="2" class="input" placeholder="Alamat lengkap..." />
          </div>
        </div>

        <div class="card p-5">
          <h2 class="font-display font-semibold text-slate-900">Metode Pembayaran</h2>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <label class="flex cursor-pointer items-center gap-3 rounded-xl border p-3" :class="form.payment_method === 'transfer' ? 'border-primary-500 bg-primary-50' : 'border-slate-200'">
              <input v-model="form.payment_method" type="radio" value="transfer" class="accent-primary-600">
              <span class="text-sm font-semibold">Transfer Bank</span>
            </label>
            <label class="flex cursor-pointer items-center gap-3 rounded-xl border p-3" :class="form.payment_method === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-slate-200'">
              <input v-model="form.payment_method" type="radio" value="cash" class="accent-primary-600">
              <span class="text-sm font-semibold">Bayar di Tempat</span>
            </label>
          </div>
          <div class="mt-4">
            <label class="label">Catatan (opsional)</label>
            <input v-model="form.notes" class="input" placeholder="Catatan untuk pesanan...">
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-20 p-5">
          <h2 class="font-display font-semibold text-slate-900">Ringkasan Pesanan</h2>
          <ul class="mt-3 max-h-56 space-y-2 overflow-y-auto">
            <li v-for="i in cart.items" :key="i.product_id" class="flex justify-between gap-2 text-sm">
              <span class="min-w-0 truncate text-slate-600">{{ i.qty }}× {{ i.name }}</span>
              <span class="shrink-0 font-medium">{{ rupiah(i.price * i.qty) }}</span>
            </li>
          </ul>
          <div class="mt-3 flex justify-between border-t border-slate-100 pt-3">
            <span class="font-semibold text-slate-700">Total</span>
            <span class="font-display text-lg font-bold text-primary-700">{{ rupiah(cart.subtotal) }}</span>
          </div>
          <div v-if="errorMsg" class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{{ errorMsg }}</div>
          <button type="submit" class="btn btn-primary mt-4 w-full" :disabled="loading">
            <Icon :name="loading ? 'lucide:loader-2' : 'lucide:check-circle'" :class="loading ? 'animate-spin' : ''" />
            {{ loading ? 'Memproses...' : 'Buat Pesanan' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
