import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCurrentUser,
  type AuthUser,
} from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  function setUser(authenticatedUser: AuthUser) {
    user.value = authenticatedUser
    initialized.value = true
  }

  function clearUser() {
    user.value = null
    initialized.value = true
  }

  async function restoreSession() {
    try {
      user.value = await getCurrentUser()
    } catch {
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  return {
    user,
    initialized,
    isAuthenticated,
    setUser,
    clearUser,
    restoreSession,
  }
})
