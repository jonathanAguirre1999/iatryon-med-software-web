<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store'

const authStore = useAuthStore()
</script>

<template>
  <section class="card">
    <h1>Inicio</h1>
    <p>Bienvenido {{ authStore.user?.userName }}</p>
    <p>Rol: {{ authStore.user?.role }}</p>
  </section>
</template>
