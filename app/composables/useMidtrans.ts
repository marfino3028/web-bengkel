interface PayResponse {
  snap_token: string
  redirect_url: string
  client_key: string
  is_production: boolean
}

interface SnapCallbacks {
  onSuccess?: () => void
  onPending?: () => void
  onError?: () => void
  onClose?: () => void
}

function loadSnapScript(clientKey: string, isProduction: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const w = window as unknown as { snap?: unknown }
    if (w.snap) return resolve()
    const script = document.createElement('script')
    script.src = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', clientKey)
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Gagal memuat Midtrans Snap'))
    document.head.appendChild(script)
  })
}

export function useMidtrans() {
  /**
   * Memanggil endpoint pay (mis. `/orders/ORD-xxx/pay`), memuat Snap, lalu membuka popup pembayaran.
   * Melempar error dengan pesan ramah bila gateway belum dikonfigurasi.
   */
  async function pay(endpoint: string, callbacks: SnapCallbacks = {}) {
    const res = await useApi()<PayResponse>(endpoint, { method: 'POST' })
    await loadSnapScript(res.client_key, res.is_production)
    const snap = (window as unknown as { snap: { pay: (token: string, opts: Record<string, unknown>) => void } }).snap
    snap.pay(res.snap_token, {
      onSuccess: () => callbacks.onSuccess?.(),
      onPending: () => callbacks.onPending?.(),
      onError: () => callbacks.onError?.(),
      onClose: () => callbacks.onClose?.(),
    })
  }

  return { pay }
}
