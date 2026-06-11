<script setup lang="ts">
const cart = useCartStore()
const { rupiah } = useFormat()
</script>

<template>
  <div class="container-app max-w-4xl py-8">
    <h1 class="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Keranjang</h1>

    <div v-if="cart.items.length" class="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div class="space-y-3">
        <div v-for="item in cart.items" :key="item.product_id" class="card flex gap-3 p-3">
          <img :src="item.image || ''" :alt="item.name" class="h-20 w-20 shrink-0 rounded-lg object-cover">
          <div class="flex min-w-0 flex-1 flex-col">
            <NuxtLink :to="`/produk/${item.slug}`" class="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-primary-600">
              {{ item.name }}
            </NuxtLink>
            <p class="text-sm font-bold text-primary-700">{{ rupiah(item.price) }}</p>
            <div class="mt-auto flex items-center justify-between">
              <div class="flex items-center rounded-lg border border-slate-200">
                <button class="px-2.5 py-1.5 text-slate-600 hover:text-primary-600" @click="cart.setQty(item.product_id, item.qty - 1)">
                  <Icon name="lucide:minus" class="text-sm" />
                </button>
                <span class="w-8 text-center text-sm font-semibold">{{ item.qty }}</span>
                <button class="px-2.5 py-1.5 text-slate-600 hover:text-primary-600" @click="cart.setQty(item.product_id, item.qty + 1)">
                  <Icon name="lucide:plus" class="text-sm" />
                </button>
              </div>
              <button class="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500" @click="cart.remove(item.product_id)">
                <Icon name="lucide:trash-2" />
              </button>
            </div>
          </div>
          <div class="hidden shrink-0 text-right sm:block">
            <p class="text-xs text-slate-400">Subtotal</p>
            <p class="font-semibold text-slate-800">{{ rupiah(item.price * item.qty) }}</p>
          </div>
        </div>
      </div>

      <div>
        <div class="card sticky top-20 p-5">
          <h2 class="font-display font-semibold text-slate-900">Ringkasan</h2>
          <div class="mt-4 flex justify-between text-sm text-slate-600">
            <span>Total item</span><span>{{ cart.count }}</span>
          </div>
          <div class="mt-2 flex justify-between border-t border-slate-100 pt-3">
            <span class="font-semibold text-slate-700">Subtotal</span>
            <span class="font-display text-lg font-bold text-primary-700">{{ rupiah(cart.subtotal) }}</span>
          </div>
          <NuxtLink to="/checkout" class="btn btn-primary mt-4 w-full">
            <Icon name="lucide:credit-card" /> Lanjut ke Checkout
          </NuxtLink>
          <NuxtLink to="/katalog" class="btn btn-ghost mt-2 w-full">Lanjut Belanja</NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="mt-10 flex flex-col items-center py-16 text-center">
      <Icon name="lucide:shopping-cart" class="text-6xl text-slate-300" />
      <p class="mt-4 font-medium text-slate-600">Keranjangmu masih kosong</p>
      <NuxtLink to="/katalog" class="btn btn-primary mt-4">Mulai Belanja</NuxtLink>
    </div>
  </div>
</template>
