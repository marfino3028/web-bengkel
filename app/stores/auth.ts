import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  name: string
  email: string
  phone?: string | null
  role: string
  avatar?: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  })
  const user = ref<AuthUser | null>(null)
  const ready = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email: string, password: string) {
    const res = await useApi()<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    token.value = res.token
    user.value = res.user
    return res
  }

  async function register(payload: {
    name: string
    email: string
    phone: string
    password: string
    password_confirmation: string
  }) {
    const res = await useApi()<{ token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: payload,
    })
    token.value = res.token
    user.value = res.user
    return res
  }

  async function fetchUser() {
    if (!token.value) {
      user.value = null
      ready.value = true
      return
    }
    try {
      const res = await useApi()<{ user: AuthUser }>('/auth/me')
      user.value = res.user
    } catch {
      token.value = null
      user.value = null
    }
    ready.value = true
  }

  async function updateProfile(payload: Record<string, unknown>) {
    const res = await useApi()<{ user: AuthUser }>('/auth/profile', {
      method: 'PUT',
      body: payload,
    })
    user.value = res.user
    return res
  }

  async function logout() {
    try {
      await useApi()('/auth/logout', { method: 'POST' })
    } catch {
      /* ignore */
    }
    token.value = null
    user.value = null
  }

  return { token, user, ready, isLoggedIn, login, register, fetchUser, updateProfile, logout }
})
