<script setup lang="ts">
const auth = useAuthStore()
const cart = useCartStore()
const config = useRuntimeConfig()
const route = useRoute()

const open = ref(false)
watch(() => route.fullPath, () => (open.value = false))

const links = [
  { to: '/', label: 'Beranda' },
  { to: '/katalog', label: 'Katalog' },
  { to: '/layanan', label: 'Layanan' },
  { to: '/booking', label: 'Booking' },
  { to: '/kontak', label: 'Kontak' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
    <div class="container-app flex h-16 items-center justify-between gap-3">
      <!-- Logo -->
      <NuxtLink to="/" class="flex shrink-0 items-center gap-2">
        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
          <Icon name="lucide:bike" class="text-xl" />
        </span>
        <span class="font-display text-lg font-extrabold tracking-tight text-slate-900">
          {{ config.public.siteName }}
        </span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden items-center gap-1 md:flex">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-primary-700"
          active-class="text-primary-700"
        >{{ l.label }}</NuxtLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-1.5">
        <NuxtLink to="/keranjang" class="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Keranjang">
          <Icon name="lucide:shopping-cart" class="text-xl" />
          <span
            v-if="cart.count"
            class="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-500 px-1 text-xs font-bold text-white"
          >{{ cart.count }}</span>
        </NuxtLink>

        <NuxtLink v-if="auth.isLoggedIn" to="/akun" class="hidden items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 sm:flex">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
          </span>
          <span class="max-w-24 truncate text-sm font-medium text-slate-700">{{ auth.user?.name }}</span>
        </NuxtLink>
        <NuxtLink v-else to="/login" class="btn btn-primary hidden text-sm sm:inline-flex">Masuk</NuxtLink>

        <!-- Mobile toggle -->
        <button class="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden" aria-label="Menu" @click="open = !open">
          <Icon :name="open ? 'lucide:x' : 'lucide:menu'" class="text-2xl" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="open" class="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
          active-class="bg-primary-50 text-primary-700"
        >{{ l.label }}</NuxtLink>
        <div class="mt-2 border-t border-slate-100 pt-2">
          <NuxtLink v-if="auth.isLoggedIn" to="/akun" class="block rounded-lg px-3 py-2.5 font-medium text-slate-700 hover:bg-slate-100">
            Akun Saya
          </NuxtLink>
          <NuxtLink v-else to="/login" class="btn btn-primary w-full">Masuk / Daftar</NuxtLink>
        </div>
      </nav>
    </Transition>
  </header>
</template>
