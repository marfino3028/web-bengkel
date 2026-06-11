export interface SiteSettings {
  site_name?: string
  tagline?: string
  about?: string
  address?: string
  phone?: string
  whatsapp?: string
  email?: string
  hours?: string
  instagram?: string
  facebook?: string
  maps_url?: string
  logo?: string
}

export function useSiteSettings() {
  return useAsyncData<SiteSettings>(
    'site-settings',
    async () => {
      const res = await useApi()<{ data: SiteSettings }>('/settings')
      return res.data
    },
    { default: () => ({}) }
  )
}
