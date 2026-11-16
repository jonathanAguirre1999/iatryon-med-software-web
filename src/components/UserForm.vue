<script setup lang="ts">
import { computed, reactive, watch, ref } from "vue";
import type { IdType } from "../services/users.service";
import type { UserRole } from "../types/auth";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../services/users.service";

const props = defineProps<{
  user?: User | null;
}>();

const emit = defineEmits<{
  submit: [data: CreateUserRequest | UpdateUserRequest];
  cancel: [];
}>();

function handleToUpperCase(event: Event) {
  const input = event.target as HTMLInputElement;

  form.fullName = input.value.toUpperCase();
}

const form = reactive({
  fullName: "",
  userName: "",
  password: "",
  email: "",
  idType: "CEDULA" as IdType,
  idNumber: "",
  role: "RECEPTIONIST" as UserRole,
});

const formError = computed(() => {
  if (!form.fullName.trim()) {
    return "El nombre es obligatorio";
  }

  if (!form.userName.trim()) {
    return "El nombre de usuario es obligatorio";
  }

  if (!isEditing.value && !form.password) {
    return "La contraseña es obligatoria";
  }

  if (!form.idNumber.trim()) {
    return "El número de identificación es obligatorio";
  }

  if (!form.email.trim()) {
    return "El correo es obligatorio";
  }
  return null;
});

const isEditing = computed(() => !!props.user);

function resetForm() {
  form.fullName = "";
  form.userName = "";
  form.password = "";
  form.email = "";
  form.idNumber = "";
  form.idType = "CEDULA";
  form.role = "RECEPTIONIST";
}

watch(
  () => props.user,
  (user) => {
    if (user) {
      form.fullName = user.fullName;
      form.userName = user.userName;
      form.role = user.role;
      form.password = "";
      form.email = user.email;
      form.idNumber = user.idNumber;
      form.idType = user.idType;
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

function handleSubmit() {
  if (formError.value) {
    return;
  }

  if (isEditing.value) {
    const data: UpdateUserRequest = {
      fullName: form.fullName.trim(),
      userName: form.userName.trim(),
      role: form.role,
      email: form.email.trim(),
      idType: form.idType,
      idNumber: form.idNumber.trim(),
    };

    emit("submit", data);
    return;
  }

  const data: CreateUserRequest = {
    fullName: form.fullName.trim().toUpperCase(),
    userName: form.userName.trim(),
    password: form.password,
    role: form.role,
    idType: form.idType,
    idNumber: form.idNumber,
    email: form.email,
  };

  emit("submit", data);
}

function handleCancel() {
  resetForm();
  emit("cancel");
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h2 class="section-title">
      {{ isEditing ? "Editar usuario" : "Nuevo usuario" }}
    </h2>

    <div class="form-grid-3">
      <div class="form-field">
        <label for="fullName">Nombre completo</label>

        <input
          id="fullName"
          v-model="form.fullName"
          type="text"
          @input="handleToUpperCase"
        />
      </div>

      <div class="form-field">
        <label for="userName">Usuario</label>

        <input id="userName" v-model="form.userName" type="text" />
      </div>

      <div v-if="!isEditing" class="form-field">
        <label for="password">Contraseña</label>

        <input id="password" v-model="form.password" type="password" />
      </div>

      <div class="form-field">
        <label for="role">Rol</label>

        <select id="role" v-model="form.role">
          <option value="ADMIN">Administrador</option>

          <option value="DOCTOR">Doctor</option>

          <option value="RECEPTIONIST">Recepcionista</option>
        </select>
      </div>

      <div class="form-field">
        <label for="idType">Tipo de identificación</label>

        <select id="idType" v-model="form.idType">
          <option value="CEDULA">Cédula</option>

          <option value="PASAPORTE">Pasaporte</option>

          <option value="LICENCIA">Licencia</option>

          <option value="OTRO">Otro</option>
        </select>
      </div>

      <div class="form-field">
        <label for="idNumber">Número de {{ form.idType.toLowerCase() }}</label>

        <input id="idNumber" v-model="form.idNumber" type="text" />
      </div>

      <div class="form-field">
        <label for="email">Correo</label>

        <input id="email" v-model="form.email" type="email" />
      </div>
    </div>

    <p v-if="formError">
      {{ formError }}
    </p>

    <div class="actions">
      <button type="submit" class="btn-success" :disabled="!!formError">
        {{ isEditing ? "Guardar cambios" : "Crear usuario" }}
      </button>

      <button type="button" class="btn-secondary" @click="handleCancel">
        Cancelar
      </button>
    </div>
  </form>
</template>
