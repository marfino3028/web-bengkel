<script setup lang="ts">
import type { Service } from '~/types/models'

definePageMeta({ middleware: 'auth' })

const { rupiah } = useFormat()

const { data: services } = await useAsyncData('booking-services', async () => {
  const res = await useApi()<{ data: Service[] }>('/services')
  return res.data
})

const form = reactive({
  service_ids: [] as number[],
  vehicle_brand: '',
  vehicle_model: '',
  vehicle_plate: '',
  vehicle_year: '',
  scheduled_at: '',
  complaint: '',
})

const loading = ref(false)
const errorMsg = ref('')

const total = computed(() =>
  (services.value ?? [])
    .filter((s) => form.service_ids.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0)
)

function toggleService(id: number) {
  const i = form.service_ids.indexOf(id)
  if (i >= 0) form.service_ids.splice(i, 1)
  else form.service_ids.push(id)
}

async function submit() {
  errorMsg.value = ''
  if (!form.service_ids.length) {
    errorMsg.value = 'Pilih minimal satu layanan.'
    return
  }
  loading.value = true
  try {
    const res = await useApi()<{ data: { booking_code: string } }>('/bookings', {
      method: 'POST',
      body: { ...form, scheduled_at: new Date(form.scheduled_at).toISOString() },
    })
    await navigateTo(`/akun/booking/${res.data.booking_code}`)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal membuat booking. Periksa kembali isian Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container-app max-w-3xl py-8">
    <h1 class="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Booking Servis</h1>
    <p class="mt-1 text-sm text-slate-500">Isi data di bawah, tim kami akan mengkonfirmasi jadwalmu.</p>

    <form class="mt-6 space-y-6" @submit.prevent="submit">
      <!-- Pilih layanan -->
      <div class="card p-5">
        <h2 class="font-display font-semibold text-slate-900">1. Pilih Layanan</h2>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <label
            v-for="s in services"
            :key="s.id"
            class="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition"
            :class="form.service_ids.includes(s.id) ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300'"
          >
            <input
              type="checkbox"
              class="mt-1 h-4 w-4 accent-primary-600"
              :checked="form.service_ids.includes(s.id)"
              @change="toggleService(s.id)"
            >
            <span class="min-w-0">
              <span class="block text-sm font-semibold text-slate-800">{{ s.name }}</span>
              <span class="block text-sm font-bold text-primary-700">{{ rupiah(s.price) }}</span>
            </span>
          </label>
        </div>
      </div>

      <!-- Data motor -->
      <div class="card p-5">
        <h2 class="font-display font-semibold text-slate-900">2. Data Motor</h2>
        <div class="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Merek</label>
            <input v-model="form.vehicle_brand" required class="input" placeholder="cth: Honda">
          </div>
          <div>
            <label class="label">Tipe / Model</label>
            <input v-model="form.vehicle_model" required class="input" placeholder="cth: Vario 125">
          </div>
          <div>
            <label class="label">Plat Nomor</label>
            <input v-model="form.vehicle_plate" required class="input uppercase" placeholder="cth: B 1234 ABC">
          </div>
          <div>
            <label class="label">Tahun (opsional)</label>
            <input v-model="form.vehicle_year" class="input" placeholder="cth: 2021">
          </div>
        </div>
      </div>

      <!-- Jadwal & keluhan -->
      <div class="card p-5">
        <h2 class="font-display font-semibold text-slate-900">3. Jadwal & Keluhan</h2>
        <div class="mt-3 space-y-4">
          <div>
            <label class="label">Tanggal & Jam Servis</label>
            <input v-model="form.scheduled_at" type="datetime-local" required class="input">
          </div>
          <div>
            <label class="label">Keluhan / Catatan</label>
            <textarea v-model="form.complaint" required rows="3" class="input" placeholder="Ceritakan keluhan motormu..." />
          </div>
        </div>
      </div>

      <div v-if="errorMsg" class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        {{ errorMsg }}
      </div>

      <div class="card flex flex-col items-center justify-between gap-3 p-5 sm:flex-row">
        <div>
          <p class="text-sm text-slate-500">Estimasi total layanan</p>
          <p class="font-display text-2xl font-bold text-primary-700">{{ rupiah(total) }}</p>
        </div>
        <button type="submit" class="btn btn-primary w-full sm:w-auto" :disabled="loading">
          <Icon :name="loading ? 'lucide:loader-2' : 'lucide:calendar-check'" :class="loading ? 'animate-spin' : ''" />
          {{ loading ? 'Memproses...' : 'Kirim Booking' }}
        </button>
      </div>
    </form>
  </div>
</template>
