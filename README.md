# BengkelKu Web (Nuxt 4)

Website publik **bengkel motor** untuk pelanggan: beranda, katalog sparepart, layanan servis, booking servis, keranjang & checkout, akun + riwayat transaksi. Desain modern, responsif (mobile & desktop, tanpa overflow), tema **biru + aksen oranye**. SSR via Nuxt 4 + Tailwind CSS v4.

Terhubung ke [api-bengkel](https://github.com/marfino3028/api-bengkel) (Laravel). Bagian dari ekosistem **BengkelKu** (api · cms · web · mobile).

---

## 🚀 Menjalankan Lokal

```bash
npm install
cp .env.example .env       # set NUXT_PUBLIC_API_BASE ke URL API kamu
npm run dev                # http://localhost:3000
```

Pastikan API (Laravel) berjalan, mis. `http://localhost:8000`, lalu `.env`:
```
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

Build produksi: `npm run build` lalu `node .output/server/index.mjs`.

---

## ☁️ Deploy ke Koyeb (Docker)

1. [koyeb.com](https://www.koyeb.com) → **Create Service** → **GitHub** → pilih `marfino3028/web-bengkel`.
2. **Builder**: pilih **Dockerfile** (sudah disediakan di repo).
3. **Port**: `8000` (sesuai `EXPOSE`/`PORT` di Dockerfile).
4. **Environment variables**:
   ```
   NUXT_PUBLIC_API_BASE=https://api-bengkel-production.up.railway.app/api
   ```
   (ganti dengan domain API kamu; bila pakai domain Cloudflare → `https://api.domainmu.com/api`)
5. **Deploy**. Koyeb memberi URL seperti `https://web-bengkel-<org>.koyeb.app`.

> Nuxt membaca `NUXT_PUBLIC_API_BASE` saat runtime, jadi cukup set di Koyeb tanpa rebuild manual.

---

## 🌐 Custom Domain via Cloudflare (subdomain `www`/root)

Untuk website publik gunakan domain utama atau **`www`**:

1. **Koyeb** → service → *Settings* → **Domains** → **Add domain** → `www.domainmu.com`. Koyeb menampilkan target CNAME (mis. `xxxx.koyeb.app`).
2. **Cloudflare** → **DNS** → **Add record**: Type `CNAME` · Name `www` · Target `xxxx.koyeb.app` · Proxy **DNS only** dulu (aktifkan oranye setelah SSL terbit).
3. (Opsional) Redirect root `domainmu.com` → `www` lewat Cloudflare *Redirect Rules*, atau tambahkan record `CNAME` `@` ke target Koyeb.
4. Selesai — website di `https://www.domainmu.com`.

**Ringkasan 3 subdomain ekosistem:**
| Subdomain | Tujuan | Platform |
|---|---|---|
| `api.domainmu.com` | API Laravel | Railway |
| `cms.domainmu.com` | Panel admin | Koyeb |
| `www.domainmu.com` | Website publik (repo ini) | Koyeb |

---

## 🛠️ Stack
Nuxt 4 (SSR) · Vue 3 · Tailwind CSS v4 · Pinia · @nuxt/icon (Lucide).
