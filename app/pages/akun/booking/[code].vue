<script setup lang="ts">
import type { Booking } from '~/types/models'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { rupiah, dateTime } = useFormat()

const { data: booking, refresh } = await useAsyncData(`booking-${route.params.code}`, async () => {
  try {
    const res = await useApi()<{ data: Booking }>(`/bookings/${route.params.code}`)
    return res.data
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Booking tidak ditemukan', fatal: true })
  }
})

const cancelling = ref(false)
async function cancel() {
  if (!confirm('Batalkan booking ini?')) return
  cancelling.value = true
  try {
    await useApi()(`/bookings/${route.params.code}/cancel`, { method: 'POST' })
    await refresh()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal membatalkan booking.')
  } finally {
    cancelling.value = false
  }
}
</script>

<template>
  <div v-if="booking" class="container-app max-w-3xl py-8">
    <NuxtLink to="/akun" class="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-600">
      <Icon name="lucide:arrow-left" /> Kembali ke akun
    </NuxtLink>

    <div class="card p-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="font-display text-xl font-bold text-slate-900">{{ booking.booking_code }}</h1>
          <p class="text-sm text-slate-500">Dibuat {{ dateTime(booking.created_at) }}</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <StatusBadge :status="booking.status" />
          <StatusBadge :status="booking.payment_status" />
        </div>
      </div>

      <div class="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <div>
          <p class="text-xs text-slate-400">Motor</p>
          <p class="font-medium text-slate-700">{{ booking.vehicle_brand }} {{ booking.vehicle_model }}</p>
          <p class="text-sm text-slate-500">{{ booking.vehicle_plate }} <span v-if="booking.vehicle_year">· {{ booking.vehicle_year }}</span></p>
        </div>
        <div>
          <p class="text-xs text-slate-400">Jadwal Servis</p>
          <p class="font-medium text-slate-700">{{ dateTime(booking.scheduled_at) }}</p>
        </div>
        <div class="sm:col-span-2">
          <p class="text-xs text-slate-400">Keluhan</p>
          <p class="text-sm text-slate-600">{{ booking.complaint }}</p>
        </div>
        <div v-if="booking.admin_notes" class="sm:col-span-2">
          <p class="text-xs text-slate-400">Catatan Bengkel</p>
          <p class="text-sm text-slate-600">{{ booking.admin_notes }}</p>
        </div>
      </div>

      <h2 class="mt-6 font-display font-semibold text-slate-900">Rincian</h2>
      <ul class="mt-2 divide-y divide-slate-100">
        <li v-for="it in booking.items" :key="it.id" class="flex justify-between gap-2 py-2.5 text-sm">
          <span class="text-slate-600">
            {{ it.name }}
            <span class="badge ml-1 bg-slate-100 text-slate-500">{{ it.item_type === 'service' ? 'Jasa' : 'Sparepart' }}</span>
            <span v-if="it.qty > 1" class="text-slate-400"> ×{{ it.qty }}</span>
          </span>
          <span class="font-medium text-slate-700">{{ rupiah(it.subtotal) }}</span>
        </li>
      </ul>

      <div class="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
        <div class="flex justify-between text-slate-500"><span>Jasa servis</span><span>{{ rupiah(booking.service_total) }}</span></div>
        <div class="flex justify-between text-slate-500"><span>Sparepart</span><span>{{ rupiah(booking.parts_total) }}</span></div>
        <div class="flex justify-between pt-1 text-base font-bold text-slate-900"><span>Total</span><span class="text-primary-700">{{ rupiah(booking.grand_total) }}</span></div>
      </div>

      <button
        v-if="booking.status === 'pending'"
        class="btn btn-outline mt-6 w-full border-red-300 text-red-600 hover:bg-red-50"
        :disabled="cancelling"
        @click="cancel"
      >
        <Icon name="lucide:x-circle" /> Batalkan Booking
      </button>
    </div>
  </div>
</template>
