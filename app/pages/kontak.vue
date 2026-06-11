<script setup lang="ts">
const { data: settings } = useSiteSettings()
</script>

<template>
  <div>
    <section class="bg-gradient-to-br from-primary-700 to-primary-800 py-12 text-white">
      <div class="container-app">
        <h1 class="font-display text-3xl font-extrabold">Hubungi Kami</h1>
        <p class="mt-2 text-primary-100">{{ settings?.about }}</p>
      </div>
    </section>

    <section class="container-app grid gap-6 py-10 lg:grid-cols-2">
      <div class="card p-6">
        <h2 class="font-display text-xl font-bold text-slate-900">Informasi Bengkel</h2>
        <ul class="mt-4 space-y-4 text-sm">
          <li class="flex gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon name="lucide:map-pin" /></span>
            <div><p class="font-semibold text-slate-700">Alamat</p><p class="text-slate-500">{{ settings?.address || '-' }}</p></div>
          </li>
          <li class="flex gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon name="lucide:phone" /></span>
            <div><p class="font-semibold text-slate-700">Telepon</p><p class="text-slate-500">{{ settings?.phone || '-' }}</p></div>
          </li>
          <li class="flex gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon name="lucide:clock" /></span>
            <div><p class="font-semibold text-slate-700">Jam Operasional</p><p class="text-slate-500">{{ settings?.hours || '-' }}</p></div>
          </li>
          <li v-if="settings?.email" class="flex gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon name="lucide:mail" /></span>
            <div><p class="font-semibold text-slate-700">Email</p><p class="text-slate-500">{{ settings.email }}</p></div>
          </li>
        </ul>
        <a
          v-if="settings?.whatsapp"
          :href="`https://wa.me/${settings.whatsapp}`"
          target="_blank"
          rel="noopener"
          class="btn btn-accent mt-6 w-full"
        >
          <Icon name="lucide:message-circle" /> Chat via WhatsApp
        </a>
      </div>

      <div class="card overflow-hidden">
        <iframe
          title="Lokasi Bengkel"
          class="h-full min-h-80 w-full"
          src="https://www.google.com/maps?q=jakarta&output=embed"
          loading="lazy"
        />
      </div>
    </section>
  </div>
</template>
