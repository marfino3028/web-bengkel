<script setup lang="ts">
import type { Product } from '~/types/models'

const route = useRoute()
const { rupiah } = useFormat()
const cart = useCartStore()

const { data: product } = await useAsyncData(`product-${route.params.slug}`, async () => {
  try {
    const res = await useApi()<{ data: Product }>(`/products/${route.params.slug}`)
    return res.data
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan', fatal: true })
  }
})

const qty = ref(1)
const added = ref(false)

function addToCart(goToCart = false) {
  if (!product.value || !product.value.in_stock) return
  cart.add(
    {
      product_id: product.value.id,
      slug: product.value.slug,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image,
      stock: product.value.stock,
    },
    qty.value
  )
  if (goToCart) return navigateTo('/keranjang')
  added.value = true
  setTimeout(() => (added.value = false), 1500)
}
</script>

<template>
  <div v-if="product" class="container-app py-8">
    <nav class="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-400">
      <NuxtLink to="/" class="hover:text-primary-600">Beranda</NuxtLink>
      <Icon name="lucide:chevron-right" />
      <NuxtLink to="/katalog" class="hover:text-primary-600">Katalog</NuxtLink>
      <Icon name="lucide:chevron-right" />
      <span class="truncate text-slate-600">{{ product.name }}</span>
    </nav>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card overflow-hidden">
        <img :src="product.image || ''" :alt="product.name" class="aspect-square w-full object-cover">
      </div>

      <div>
        <p v-if="product.brand" class="text-sm font-semibold text-primary-600">{{ product.brand }}</p>
        <h1 class="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">{{ product.name }}</h1>

        <div class="mt-3">
          <span class="font-display text-3xl font-extrabold text-primary-700">{{ rupiah(product.price) }}</span>
        </div>

        <div class="mt-2">
          <span v-if="product.in_stock" class="badge bg-green-100 text-green-700">
            <Icon name="lucide:check-circle" /> Stok tersedia ({{ product.stock }})
          </span>
          <span v-else class="badge bg-red-100 text-red-700">
            <Icon name="lucide:x-circle" /> Stok habis
          </span>
        </div>

        <p class="mt-5 whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {{ product.description }}
        </p>

        <div v-if="product.in_stock" class="mt-6 flex flex-wrap items-center gap-3">
          <div class="flex items-center rounded-xl border border-slate-200">
            <button class="px-3 py-2 text-slate-600 hover:text-primary-600" @click="qty = Math.max(1, qty - 1)">
              <Icon name="lucide:minus" />
            </button>
            <span class="w-10 text-center font-semibold">{{ qty }}</span>
            <button class="px-3 py-2 text-slate-600 hover:text-primary-600" @click="qty = Math.min(product.stock, qty + 1)">
              <Icon name="lucide:plus" />
            </button>
          </div>
        </div>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row">
          <button class="btn btn-outline flex-1" :disabled="!product.in_stock" @click="addToCart(false)">
            <Icon :name="added ? 'lucide:check' : 'lucide:shopping-cart'" />
            {{ added ? 'Ditambahkan ke keranjang' : 'Tambah ke Keranjang' }}
          </button>
          <button class="btn btn-primary flex-1" :disabled="!product.in_stock" @click="addToCart(true)">
            <Icon name="lucide:zap" /> Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
