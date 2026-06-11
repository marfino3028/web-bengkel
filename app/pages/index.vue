<script setup lang="ts">
import type { Banner, Category, Product, Service } from '~/types/models'

const { data: settings } = useSiteSettings()

const { data } = await useAsyncData('home', async () => {
  const api = useApi()
  const [banners, services, products, categories] = await Promise.all([
    api<{ data: Banner[] }>('/banners'),
    api<{ data: Service[] }>('/services', { query: { featured: 1 } }),
    api<{ data: Product[] }>('/products', { query: { featured: 1, per_page: 8 } }),
    api<{ data: Category[] }>('/categories'),
  ])
  return {
    banners: banners.data,
    services: services.data,
    products: products.data,
    categories: categories.data,
  }
})

const features = [
  { icon: 'lucide:wrench', title: 'Mekanik Berpengalaman', desc: 'Ditangani teknisi ahli untuk semua merek motor.' },
  { icon: 'lucide:shield-check', title: 'Sparepart Original', desc: 'Produk bergaransi & terjamin keasliannya.' },
  { icon: 'lucide:calendar-check', title: 'Booking Online', desc: 'Pesan jadwal servis tanpa antre lama.' },
  { icon: 'lucide:wallet', title: 'Harga Transparan', desc: 'Estimasi biaya jelas sebelum dikerjakan.' },
]
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
      <div class="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div class="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-500/20 blur-2xl" />
      <div class="container-app relative grid items-center gap-8 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <span class="badge bg-white/15 text-white backdrop-blur">
            <Icon name="lucide:sparkles" /> {{ settings?.site_name || 'Bengkel Motor Juara' }}
          </span>
          <h1 class="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {{ settings?.tagline || 'Servis Motor Cepat & Sparepart Lengkap' }}
          </h1>
          <p class="mt-4 max-w-lg text-base text-primary-100">
            Booking servis online, beli sparepart original, dan pantau riwayat transaksimu — semua dalam satu tempat.
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <NuxtLink to="/booking" class="btn btn-accent">
              <Icon name="lucide:calendar-plus" /> Booking Servis
            </NuxtLink>
            <NuxtLink to="/katalog" class="btn bg-white text-primary-700 hover:bg-primary-50">
              <Icon name="lucide:shopping-bag" /> Lihat Katalog
            </NuxtLink>
          </div>
        </div>

        <div class="relative hidden lg:block">
          <div class="card overflow-hidden">
            <img
              v-if="data?.banners?.length"
              :src="data.banners[0]!.image"
              :alt="data.banners[0]!.title"
              class="aspect-[16/10] w-full object-cover"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- KATEGORI -->
    <section class="container-app py-10">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="font-display text-2xl font-bold text-slate-900">Kategori Sparepart</h2>
          <p class="text-sm text-slate-500">Temukan kebutuhan motormu</p>
        </div>
        <NuxtLink to="/katalog" class="text-sm font-semibold text-primary-600 hover:underline">Lihat semua</NuxtLink>
      </div>
      <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        <NuxtLink
          v-for="c in data?.categories?.slice(0, 10)"
          :key="c.id"
          :to="`/katalog?category=${c.slug}`"
          class="card flex flex-col items-center gap-2 p-4 text-center transition hover:border-primary-200 hover:shadow-md"
        >
          <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Icon name="lucide:cog" class="text-2xl" />
          </span>
          <span class="text-sm font-semibold text-slate-700">{{ c.name }}</span>
          <span class="text-xs text-slate-400">{{ c.products_count ?? 0 }} produk</span>
        </NuxtLink>
      </div>
    </section>

    <!-- LAYANAN UNGGULAN -->
    <section class="bg-white py-12">
      <div class="container-app">
        <div class="flex items-end justify-between gap-4">
          <div>
            <h2 class="font-display text-2xl font-bold text-slate-900">Layanan Servis</h2>
            <p class="text-sm text-slate-500">Pilih layanan, lalu booking jadwalmu</p>
          </div>
          <NuxtLink to="/layanan" class="text-sm font-semibold text-primary-600 hover:underline">Semua layanan</NuxtLink>
        </div>
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard v-for="s in data?.services?.slice(0, 3)" :key="s.id" :service="s" />
        </div>
      </div>
    </section>

    <!-- PRODUK UNGGULAN -->
    <section class="container-app py-12">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="font-display text-2xl font-bold text-slate-900">Produk Unggulan</h2>
          <p class="text-sm text-slate-500">Sparepart terlaris pilihan kami</p>
        </div>
        <NuxtLink to="/katalog" class="text-sm font-semibold text-primary-600 hover:underline">Lihat semua</NuxtLink>
      </div>
      <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <ProductCard v-for="p in data?.products" :key="p.id" :product="p" />
      </div>
    </section>

    <!-- KEUNGGULAN -->
    <section class="bg-white py-12">
      <div class="container-app">
        <h2 class="text-center font-display text-2xl font-bold text-slate-900">Kenapa Memilih Kami?</h2>
        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="f in features" :key="f.title" class="card p-5">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-500">
              <Icon :name="f.icon" class="text-2xl" />
            </span>
            <h3 class="mt-3 font-display font-bold text-slate-900">{{ f.title }}</h3>
            <p class="mt-1 text-sm text-slate-500">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="container-app py-12">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-10 text-center text-white sm:px-12">
        <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/30 blur-2xl" />
        <h2 class="relative font-display text-2xl font-bold sm:text-3xl">Motormu butuh perawatan?</h2>
        <p class="relative mt-2 text-primary-100">Booking sekarang, kami siap melayani.</p>
        <NuxtLink to="/booking" class="btn btn-accent relative mt-6">
          <Icon name="lucide:calendar-plus" /> Booking Servis Sekarang
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
