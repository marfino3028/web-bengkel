<script setup lang="ts">
import type { Service } from '~/types/models'

defineProps<{ service: Service }>()
const { rupiah } = useFormat()
</script>

<template>
  <div class="card group flex flex-col overflow-hidden transition hover:shadow-md">
    <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img
        :src="service.image || ''"
        :alt="service.name"
        loading="lazy"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
      <h3 class="absolute bottom-3 left-4 right-4 font-display text-lg font-bold text-white drop-shadow">
        {{ service.name }}
      </h3>
    </div>
    <div class="flex flex-1 flex-col p-4">
      <p class="line-clamp-2 flex-1 text-sm text-slate-500">{{ service.description }}</p>
      <div class="mt-3 flex items-center justify-between gap-2">
        <div>
          <p class="text-xs text-slate-400">Mulai dari</p>
          <p class="font-display font-bold text-primary-700">{{ rupiah(service.price) }}</p>
        </div>
        <span v-if="service.duration_minutes" class="badge bg-slate-100 text-slate-600">
          <Icon name="lucide:clock" /> {{ service.duration_minutes }} mnt
        </span>
      </div>
      <NuxtLink to="/booking" class="btn btn-outline mt-3 w-full text-sm">
        <Icon name="lucide:calendar-plus" /> Booking Servis
      </NuxtLink>
    </div>
  </div>
</template>
