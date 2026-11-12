<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { logout } from '../services/auth.service'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  try {
    await logout()
  } finally {
    authStore.clearUser()
    await router.push('/login')
  }
}
</script>

<template>
  <div class="layout">
    <header class="layout-header">
      <strong>IATRYON</strong>

      <div>
        <span>Hola, {{ authStore.user?.userName }}</span>
        <button type="button" @click="handleLogout">
          Cerrar sesión
        </button>
      </div>
    </header>

    <aside class="layout-sidebar">
      <nav>
        <RouterLink to="/">Inicio</RouterLink>

        <RouterLink
          v-if="authStore.user?.role === 'ADMIN'"
          to="/users"
        >
          Usuarios
        </RouterLink>

        <RouterLink to="/patients">
          Pacientes
        </RouterLink>
      </nav>
    </aside>

    <main class="layout-main">
      <RouterView />
    </main>
  </div>
</template>
