<script setup lang="ts">
import type { Order } from '~/types/models'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { rupiah, dateTime } = useFormat()

const { data: order, refresh } = await useAsyncData(`order-${route.params.code}`, async () => {
  try {
    const res = await useApi()<{ data: Order }>(`/orders/${route.params.code}`)
    return res.data
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Pesanan tidak ditemukan', fatal: true })
  }
})

const cancelling = ref(false)
async function cancel() {
  if (!confirm('Batalkan pesanan ini?')) return
  cancelling.value = true
  try {
    await useApi()(`/orders/${route.params.code}/cancel`, { method: 'POST' })
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal membatalkan pesanan.')
  } finally {
    cancelling.value = false
  }
}
</script>

<template>
  <div v-if="order" class="container-app max-w-3xl py-8">
    <NuxtLink to="/akun" class="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
      <Icon name="lucide:arrow-left" /> Kembali ke akun
    </NuxtLink>

    <div class="card p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="font-display text-xl font-bold text-slate-900">{{ order.order_code }}</h1>
          <p class="text-sm text-slate-500">Dibuat {{ dateTime(order.created_at) }}</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <StatusBadge :status="order.status" />
          <StatusBadge :status="order.payment_status" />
        </div>
      </div>

      <div
        v-if="order.payment_status === 'unpaid' && order.payment_method === 'transfer' && order.status !== 'cancelled'"
        class="mt-4 rounded-xl bg-accent-50 p-4 text-sm text-accent-600"
      >
        <p class="font-semibold"><Icon name="lucide:info" /> Menunggu Pembayaran</p>
        <p class="mt-1">Silakan transfer sejumlah <b>{{ rupiah(order.total) }}</b> lalu konfirmasi ke admin via WhatsApp.</p>
      </div>

      <h2 class="mt-6 font-display font-semibold text-slate-900">Item Pesanan</h2>
      <ul class="mt-2 divide-y divide-slate-100">
        <li v-for="it in order.items" :key="it.id" class="flex items-center gap-3 py-3">
          <img v-if="it.image" :src="it.image" :alt="it.product_name" class="h-12 w-12 rounded-lg object-cover">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-slate-700">{{ it.product_name }}</p>
            <p class="text-xs text-slate-400">{{ rupiah(it.price) }} × {{ it.qty }}</p>
          </div>
          <span class="shrink-0 text-sm font-semibold text-slate-700">{{ rupiah(it.subtotal) }}</span>
        </li>
      </ul>

      <div class="mt-4 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
        <div>
          <p class="text-xs text-slate-400">Pengambilan</p>
          <p class="font-medium text-slate-700">{{ order.fulfillment === 'pickup' ? 'Ambil di Bengkel' : 'Diantar' }}</p>
          <p v-if="order.shipping_address" class="text-slate-500">{{ order.shipping_address }}</p>
        </div>
        <div>
          <p class="text-xs text-slate-400">Pembayaran</p>
          <p class="font-medium text-slate-700">{{ order.payment_method === 'cash' ? 'Bayar di Tempat' : 'Transfer Bank' }}</p>
        </div>
      </div>

      <div class="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
        <div class="flex justify-between text-slate-500"><span>Subtotal</span><span>{{ rupiah(order.subtotal) }}</span></div>
        <div class="flex justify-between text-slate-500"><span>Ongkir</span><span>{{ rupiah(order.shipping_cost) }}</span></div>
        <div class="flex justify-between pt-1 text-base font-bold text-slate-900"><span>Total</span><span class="text-primary-700">{{ rupiah(order.total) }}</span></div>
      </div>

      <button
        v-if="order.status === 'pending'"
        class="btn btn-outline mt-6 w-full border-red-300 text-red-600 hover:bg-red-50"
        :disabled="cancelling"
        @click="cancel"
      >
        <Icon name="lucide:x-circle" /> Batalkan Pesanan
      </button>
    </div>
  </div>
</template>
