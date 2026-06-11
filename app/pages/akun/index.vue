<script setup lang="ts">
import type { Booking, Order, Paginated } from '~/types/models'

definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const { rupiah, dateTime } = useFormat()

const tab = ref<'bookings' | 'orders' | 'profile'>('bookings')

const { data: bookings } = await useAsyncData('my-bookings', async () => {
  const res = await useApi()<Paginated<Booking>>('/bookings')
  return res.data
})
const { data: orders } = await useAsyncData('my-orders', async () => {
  const res = await useApi()<Paginated<Order>>('/orders')
  return res.data
})

// Edit profil
const profileForm = reactive({ name: auth.user?.name || '', phone: auth.user?.phone || '' })
const savingProfile = ref(false)
const profileMsg = ref('')
async function saveProfile() {
  savingProfile.value = true
  profileMsg.value = ''
  try {
    await auth.updateProfile({ ...profileForm })
    profileMsg.value = 'Profil berhasil diperbarui.'
  } catch {
    profileMsg.value = 'Gagal memperbarui profil.'
  } finally {
    savingProfile.value = false
  }
}

async function doLogout() {
  await auth.logout()
  await navigateTo('/')
}
</script>

<template>
  <div class="container-app max-w-4xl py-8">
    <!-- Header profil -->
    <div class="card flex flex-col items-center gap-4 p-6 sm:flex-row">
      <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 font-display text-2xl font-bold text-primary-700">
        {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
      </span>
      <div class="flex-1 text-center sm:text-left">
        <h1 class="font-display text-xl font-bold text-slate-900">{{ auth.user?.name }}</h1>
        <p class="text-sm text-slate-500">{{ auth.user?.email }} · {{ auth.user?.phone }}</p>
      </div>
      <button class="btn btn-outline" @click="doLogout"><Icon name="lucide:log-out" /> Keluar</button>
    </div>

    <!-- Tabs -->
    <div class="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm">
      <button
        v-for="t in [{ k: 'bookings', l: 'Booking Servis' }, { k: 'orders', l: 'Pesanan' }, { k: 'profile', l: 'Profil' }]"
        :key="t.k"
        class="flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition"
        :class="tab === t.k ? 'bg-primary-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
        @click="tab = t.k as any"
      >{{ t.l }}</button>
    </div>

    <!-- Bookings -->
    <div v-if="tab === 'bookings'" class="mt-5 space-y-3">
      <template v-if="bookings?.length">
        <NuxtLink
          v-for="b in bookings"
          :key="b.id"
          :to="`/akun/booking/${b.booking_code}`"
          class="card flex items-center justify-between gap-3 p-4 transition hover:shadow-md"
        >
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold text-slate-800">{{ b.booking_code }}</span>
              <StatusBadge :status="b.status" />
            </div>
            <p class="mt-1 truncate text-sm text-slate-500">{{ b.vehicle_brand }} {{ b.vehicle_model }} · {{ dateTime(b.scheduled_at) }}</p>
          </div>
          <div class="shrink-0 text-right">
            <p class="font-display font-bold text-primary-700">{{ rupiah(b.grand_total) }}</p>
            <Icon name="lucide:chevron-right" class="text-slate-300" />
          </div>
        </NuxtLink>
      </template>
      <div v-else class="card py-12 text-center text-slate-400">
        <Icon name="lucide:calendar-x" class="text-4xl" />
        <p class="mt-2">Belum ada booking. <NuxtLink to="/booking" class="font-semibold text-primary-600">Booking sekarang</NuxtLink></p>
      </div>
    </div>

    <!-- Orders -->
    <div v-else-if="tab === 'orders'" class="mt-5 space-y-3">
      <template v-if="orders?.length">
        <NuxtLink
          v-for="o in orders"
          :key="o.id"
          :to="`/akun/pesanan/${o.order_code}`"
          class="card flex items-center justify-between gap-3 p-4 transition hover:shadow-md"
        >
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold text-slate-800">{{ o.order_code }}</span>
              <StatusBadge :status="o.status" />
              <StatusBadge :status="o.payment_status" />
            </div>
            <p class="mt-1 truncate text-sm text-slate-500">{{ o.items?.length || 0 }} item · {{ dateTime(o.created_at) }}</p>
          </div>
          <div class="shrink-0 text-right">
            <p class="font-display font-bold text-primary-700">{{ rupiah(o.total) }}</p>
            <Icon name="lucide:chevron-right" class="text-slate-300" />
          </div>
        </NuxtLink>
      </template>
      <div v-else class="card py-12 text-center text-slate-400">
        <Icon name="lucide:package-x" class="text-4xl" />
        <p class="mt-2">Belum ada pesanan. <NuxtLink to="/katalog" class="font-semibold text-primary-600">Mulai belanja</NuxtLink></p>
      </div>
    </div>

    <!-- Profile -->
    <div v-else class="mt-5">
      <div class="card max-w-lg p-6">
        <h2 class="font-display font-semibold text-slate-900">Edit Profil</h2>
        <div class="mt-4 space-y-4">
          <div>
            <label class="label">Nama</label>
            <input v-model="profileForm.name" class="input">
          </div>
          <div>
            <label class="label">No. WhatsApp</label>
            <input v-model="profileForm.phone" class="input">
          </div>
          <p v-if="profileMsg" class="text-sm font-medium text-green-600">{{ profileMsg }}</p>
          <button class="btn btn-primary" :disabled="savingProfile" @click="saveProfile">
            <Icon v-if="savingProfile" name="lucide:loader-2" class="animate-spin" /> Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
