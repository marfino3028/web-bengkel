<script setup lang="ts">
import type { Product } from '~/types/models'

const props = defineProps<{ product: Product }>()
const { rupiah } = useFormat()
const cart = useCartStore()

const added = ref(false)
function addToCart() {
  if (!props.product.in_stock) return
  cart.add({
    product_id: props.product.id,
    slug: props.product.slug,
    name: props.product.name,
    price: props.product.price,
    image: props.product.image,
    stock: props.product.stock,
  })
  added.value = true
  setTimeout(() => (added.value = false), 1200)
}
</script>

<template>
  <div class="card group flex flex-col overflow-hidden transition hover:shadow-md">
    <NuxtLink :to="`/produk/${product.slug}`" class="block">
      <div class="relative aspect-square overflow-hidden bg-slate-100">
        <img
          :src="product.image || ''"
          :alt="product.name"
          loading="lazy"
          class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        >
        <span
          v-if="product.is_featured"
          class="badge absolute left-2 top-2 bg-accent-500 text-white"
        >Unggulan</span>
        <span
          v-if="!product.in_stock"
          class="badge absolute right-2 top-2 bg-red-500 text-white"
        >Stok Habis</span>
      </div>
    </NuxtLink>

    <div class="flex flex-1 flex-col p-3 sm:p-4">
      <p v-if="product.brand" class="text-xs font-medium text-slate-400">{{ product.brand }}</p>
      <NuxtLink :to="`/produk/${product.slug}`" class="mt-0.5 line-clamp-2 flex-1 text-sm font-semibold text-slate-800 hover:text-primary-600">
        {{ product.name }}
      </NuxtLink>
      <p class="mt-2 font-display text-base font-bold text-primary-700">{{ rupiah(product.price) }}</p>

      <button
        class="btn btn-primary mt-3 w-full text-sm"
        :disabled="!product.in_stock"
        @click="addToCart"
      >
        <Icon :name="added ? 'lucide:check' : 'lucide:shopping-cart'" />
        {{ added ? 'Ditambahkan' : 'Keranjang' }}
      </button>
    </div>
  </div>
</template>
