<script setup lang="ts">
import type { Category, Paginated, Product } from '~/types/models'

const route = useRoute()
const router = useRouter()

const category = ref((route.query.category as string) || '')
const search = ref((route.query.search as string) || '')
const sort = ref((route.query.sort as string) || 'newest')
const page = ref(Number(route.query.page) || 1)

const { data: categories } = await useAsyncData('catalog-categories', async () => {
  const res = await useApi()<{ data: Category[] }>('/categories')
  return res.data
})

const { data, pending } = await useAsyncData(
  'catalog-products',
  () =>
    useApi()<Paginated<Product>>('/products', {
      query: {
        category: category.value || undefined,
        search: search.value || undefined,
        sort: sort.value,
        page: page.value,
        per_page: 12,
      },
    }),
  { watch: [category, search, sort, page] }
)

watch([category, search, sort, page], () => {
  router.replace({
    query: {
      category: category.value || undefined,
      search: search.value || undefined,
      sort: sort.value !== 'newest' ? sort.value : undefined,
      page: page.value > 1 ? page.value : undefined,
    },
  })
})

watch([category, search, sort], () => (page.value = 1))

let t: ReturnType<typeof setTimeout>
const searchInput = ref(search.value)
watch(searchInput, (v) => {
  clearTimeout(t)
  t = setTimeout(() => (search.value = v), 400)
})

function selectCategory(slug: string) {
  category.value = category.value === slug ? '' : slug
}
</script>

<template>
  <div class="container-app py-8">
    <h1 class="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Katalog Sparepart</h1>
    <p class="mt-1 text-sm text-slate-500">Sparepart original & bergaransi untuk semua merek motor.</p>

    <div class="mt-6 grid gap-6 lg:grid-cols-[230px_1fr]">
      <!-- Sidebar kategori (desktop) -->
      <aside class="hidden lg:block">
        <div class="card sticky top-20 p-4">
          <h3 class="font-display font-semibold text-slate-900">Kategori</h3>
          <ul class="mt-3 space-y-1">
            <li>
              <button
                class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition"
                :class="!category ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'"
                @click="category = ''"
              >Semua</button>
            </li>
            <li v-for="c in categories" :key="c.id">
              <button
                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition"
                :class="category === c.slug ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'"
                @click="selectCategory(c.slug)"
              >
                <span>{{ c.name }}</span>
                <span class="text-xs text-slate-400">{{ c.products_count ?? 0 }}</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      <div>
        <!-- Toolbar -->
        <div class="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <div class="relative flex-1">
            <Icon name="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="searchInput" type="search" placeholder="Cari sparepart..." class="input pl-10">
          </div>
          <select v-model="category" class="input sm:w-44 lg:hidden">
            <option value="">Semua Kategori</option>
            <option v-for="c in categories" :key="c.id" :value="c.slug">{{ c.name }}</option>
          </select>
          <select v-model="sort" class="input sm:w-44">
            <option value="newest">Terbaru</option>
            <option value="price_asc">Harga Termurah</option>
            <option value="price_desc">Harga Termahal</option>
          </select>
        </div>

        <!-- Hasil -->
        <div v-if="pending" class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          <div v-for="n in 6" :key="n" class="card aspect-[3/4] animate-pulse bg-slate-100" />
        </div>

        <div v-else-if="data && data.data.length" class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          <ProductCard v-for="p in data.data" :key="p.id" :product="p" />
        </div>

        <div v-else class="mt-10 flex flex-col items-center py-16 text-center">
          <Icon name="lucide:package-x" class="text-5xl text-slate-300" />
          <p class="mt-3 font-medium text-slate-600">Produk tidak ditemukan</p>
          <p class="text-sm text-slate-400">Coba ubah kata kunci atau kategori.</p>
        </div>

        <!-- Pagination -->
        <div v-if="data && data.meta.last_page > 1" class="mt-8 flex items-center justify-center gap-2">
          <button class="btn btn-outline px-3" :disabled="page <= 1" @click="page--">
            <Icon name="lucide:chevron-left" />
          </button>
          <span class="text-sm font-medium text-slate-600">Hal {{ data.meta.current_page }} / {{ data.meta.last_page }}</span>
          <button class="btn btn-outline px-3" :disabled="page >= data.meta.last_page" @click="page++">
            <Icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
