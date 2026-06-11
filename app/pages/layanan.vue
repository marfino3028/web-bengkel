<script setup lang="ts">
import type { Service } from '~/types/models'

const { data: services } = await useAsyncData('all-services', async () => {
  const res = await useApi()<{ data: Service[] }>('/services')
  return res.data
})
</script>

<template>
  <div>
    <section class="bg-gradient-to-br from-primary-700 to-primary-800 py-12 text-white">
      <div class="container-app">
        <h1 class="font-display text-3xl font-extrabold">Layanan Servis</h1>
        <p class="mt-2 max-w-xl text-primary-100">
          Pilih layanan yang kamu butuhkan, lalu booking jadwal servis dengan mudah.
        </p>
      </div>
    </section>

    <section class="container-app py-10">
      <div v-if="services?.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCard v-for="s in services" :key="s.id" :service="s" />
      </div>
      <div v-else class="py-16 text-center text-slate-400">Belum ada layanan tersedia.</div>
    </section>
  </div>
</template>
