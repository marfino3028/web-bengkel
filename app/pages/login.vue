<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const redirect = computed(() => (route.query.redirect as string) || '/akun')

async function submit() {
  errorMsg.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    await navigateTo(redirect.value)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Email atau password salah.'
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
          <Icon name="lucide:bike" class="text-2xl" />
        </span>
        <h1 class="mt-3 font-display text-2xl font-bold text-slate-900">Masuk</h1>
        <p class="text-sm text-slate-500">Selamat datang kembali!</p>
      </div>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="label">Email</label>
          <input v-model="email" type="email" required class="input" placeholder="email@contoh.com">
        </div>
        <div>
          <label class="label">Password</label>
          <input v-model="password" type="password" required class="input" placeholder="••••••••">
        </div>

        <div v-if="errorMsg" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{{ errorMsg }}</div>

        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <Icon v-if="loading" name="lucide:loader-2" class="animate-spin" />
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-500">
        Belum punya akun?
        <NuxtLink :to="`/register${route.query.redirect ? '?redirect=' + route.query.redirect : ''}`" class="font-semibold text-primary-600 hover:underline">Daftar sekarang</NuxtLink>
      </p>
    </div>
  </div>
</template>
