<script setup lang="ts">
const { data: settings } = useSiteSettings()
const config = useRuntimeConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 bg-slate-900 text-slate-300">
    <div class="container-app grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Icon name="lucide:bike" class="text-xl" />
          </span>
          <span class="font-display text-lg font-extrabold text-white">
            {{ settings?.site_name || config.public.siteName }}
          </span>
        </div>
        <p class="mt-3 text-sm leading-relaxed text-slate-400">
          {{ settings?.tagline || 'Servis motor & sparepart terpercaya.' }}
        </p>
      </div>

      <div>
        <h4 class="font-display font-semibold text-white">Menu</h4>
        <ul class="mt-3 space-y-2 text-sm">
          <li><NuxtLink to="/katalog" class="hover:text-white">Katalog Sparepart</NuxtLink></li>
          <li><NuxtLink to="/layanan" class="hover:text-white">Layanan Servis</NuxtLink></li>
          <li><NuxtLink to="/booking" class="hover:text-white">Booking Servis</NuxtLink></li>
          <li><NuxtLink to="/akun" class="hover:text-white">Akun Saya</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-display font-semibold text-white">Kontak</h4>
        <ul class="mt-3 space-y-2 text-sm text-slate-400">
          <li v-if="settings?.address" class="flex gap-2"><Icon name="lucide:map-pin" class="mt-0.5 shrink-0" /> <span>{{ settings.address }}</span></li>
          <li v-if="settings?.phone" class="flex gap-2"><Icon name="lucide:phone" class="shrink-0" /> {{ settings.phone }}</li>
          <li v-if="settings?.hours" class="flex gap-2"><Icon name="lucide:clock" class="mt-0.5 shrink-0" /> <span>{{ settings.hours }}</span></li>
        </ul>
      </div>

      <div>
        <h4 class="font-display font-semibold text-white">Ikuti Kami</h4>
        <div class="mt-3 flex gap-2">
          <a v-if="settings?.instagram" :href="`https://instagram.com/${settings.instagram}`" target="_blank" rel="noopener" class="rounded-lg bg-slate-800 p-2.5 hover:bg-primary-600">
            <Icon name="lucide:instagram" class="text-lg" />
          </a>
          <a v-if="settings?.facebook" :href="`https://facebook.com/${settings.facebook}`" target="_blank" rel="noopener" class="rounded-lg bg-slate-800 p-2.5 hover:bg-primary-600">
            <Icon name="lucide:facebook" class="text-lg" />
          </a>
          <a v-if="settings?.whatsapp" :href="`https://wa.me/${settings.whatsapp}`" target="_blank" rel="noopener" class="rounded-lg bg-slate-800 p-2.5 hover:bg-green-600">
            <Icon name="lucide:message-circle" class="text-lg" />
          </a>
        </div>
      </div>
    </div>
    <div class="border-t border-slate-800">
      <div class="container-app py-4 text-center text-sm text-slate-500">
        © {{ year }} {{ settings?.site_name || config.public.siteName }}. Seluruh hak cipta dilindungi.
      </div>
    </div>
  </footer>
</template>
