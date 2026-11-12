<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getCurrentUser,
  login,
  type LoginCredentials,
} from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive<LoginCredentials>({
  userName: "",
  password: "",
});

const loading = ref(false);
const error = ref<string | null>(null);

async function handleLogin() {
  loading.value = true;
  error.value = null;

  try {
    await login({
      userName: form.userName,
      password: form.password,
    });

    const user = await getCurrentUser();
    authStore.setUser(user);

    await router.push("/");
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Error desconocido";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="layout-main">
    <section class="card" style="max-width: 420px; margin: 3rem auto">
      <h1>IATRYON</h1>

      <form @submit.prevent="handleLogin">
        <div>
          <label for="userName">Usuario</label>
          <input
            id="userName"
            v-model="form.userName"
            type="text"
            autocomplete="username"
            required
          />
        </div>

        <div style="margin-top: 0.75rem">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" :disabled="loading" style="margin-top: 1rem">
          {{ loading ? "Iniciando sesión..." : "Ingresar" }}
        </button>
      </form>

      <p v-if="error" class="error">
        {{ error }}
      </p>
    </section>
  </main>
</template>
