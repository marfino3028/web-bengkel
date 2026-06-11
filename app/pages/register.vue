<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
})
const loading = ref(false)
const errorMsg = ref('')

const redirect = computed(() => (route.query.redirect as string) || '/akun')

async function submit() {
  errorMsg.value = ''
  if (form.password !== form.password_confirmation) {
    errorMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }
  loading.value = true
  try {
    await auth.register({ ...form })
    await navigateTo(redirect.value)
  } catch (e: any) {
    const errors = e?.data?.errors
    errorMsg.value = errors ? Object.values(errors).flat()[0] as string : (e?.data?.message || 'Gagal mendaftar.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container-app flex min-h-[70vh] items-center justify-center py-10">
    <div class="card w-full max-w-md p-6 sm:p-8">
      <div class="text-center">
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
          <Icon name="lucide:user-plus" class="text-2xl" />
        </span>
        <h1 class="mt-3 font-display text-2xl font-bold text-slate-900">Daftar Akun</h1>
        <p class="text-sm text-slate-500">Buat akun untuk booking & belanja sparepart.</p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="label">Nama Lengkap</label>
          <input v-model="form.name" required class="input" placeholder="Nama kamu">
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="form.email" type="email" required class="input" placeholder="email@contoh.com">
        </div>
        <div>
          <label class="label">No. WhatsApp</label>
          <input v-model="form.phone" required class="input" placeholder="0812xxxxxxx">
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label">Password</label>
            <input v-model="form.password" type="password" required class="input" placeholder="Min. 6 karakter">
          </div>
          <div>
            <label class="label">Ulangi Password</label>
            <input v-model="form.password_confirmation" type="password" required class="input" placeholder="••••••••">
          </div>
        </div>

        <div v-if="errorMsg" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{{ errorMsg }}</div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <Icon v-if="loading" name="lucide:loader-2" class="animate-spin" />
          {{ loading ? 'Memproses...' : 'Daftar' }}
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-500">
        Sudah punya akun?
        <NuxtLink :to="`/login${route.query.redirect ? '?redirect=' + route.query.redirect : ''}`" class="font-semibold text-primary-600 hover:underline">Masuk</NuxtLink>
      </p>
    </div>
  </div>
</template>
