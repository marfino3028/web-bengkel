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
   NUXT_PUBLIC_API_BASE=https://apibengkel.hamztech.my.id/api
   ```
   (gunakan domain API kamu; sebelum domain custom aktif bisa pakai domain Railway `https://<app>.up.railway.app/api`)
5. **Deploy**. Koyeb memberi URL seperti `https://web-bengkel-<org>.koyeb.app`.

> Nuxt membaca `NUXT_PUBLIC_API_BASE` saat runtime, jadi cukup set di Koyeb tanpa rebuild manual.

---

## 🌐 Custom Domain via Cloudflare — `webbengkel.hamztech.my.id`

Website publik dipasang di **`webbengkel.hamztech.my.id`** (Koyeb). Prasyarat: domain `hamztech.my.id` aktif di Cloudflare.

**Langkah 1 — Koyeb:** app web-bengkel → **Settings** → **Domains** → **Add domain** → `webbengkel.hamztech.my.id`. Salin target CNAME (mis. `web-bengkel-xxxx.koyeb.app`).

**Langkah 2 — Cloudflare DNS** (`hamztech.my.id` → DNS → Add record):

| Type | Name | Target | Proxy | TTL |
|---|---|---|---|---|
| `CNAME` | `webbengkel` | `web-bengkel-xxxx.koyeb.app` *(dari Koyeb)* | **DNS only** (abu-abu) | Auto |

> Wajib **DNS only** dulu agar Koyeb bisa menerbitkan SSL. Setelah aktif boleh **Proxied** + SSL/TLS **Full (strict)**.

**Langkah 3 — Tes:** buka `https://webbengkel.hamztech.my.id`.

**Langkah 4 — Env Koyeb** (lalu Redeploy):
```
NUXT_PUBLIC_API_BASE=https://apibengkel.hamztech.my.id/api
```
Pastikan API mengizinkan origin ini: di Railway set `FRONTEND_URLS` memuat `https://webbengkel.hamztech.my.id`.

**🗺️ Peta domain ekosistem:**
| Subdomain | Tujuan | Platform |
|---|---|---|
| `apibengkel.hamztech.my.id` | API Laravel | Railway |
| `cmsbengkel.hamztech.my.id` | Panel admin | Koyeb |
| `webbengkel.hamztech.my.id` | Website publik (repo ini) | Koyeb |

---

## 🛠️ Stack
Nuxt 4 (SSR) · Vue 3 · Tailwind CSS v4 · Pinia · @nuxt/icon (Lucide).
