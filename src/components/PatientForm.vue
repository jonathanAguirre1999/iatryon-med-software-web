<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import type { Patient } from "../services/patient.service";

const props = defineProps<{
  patient?: Patient | null;
}>();

const emit = defineEmits<{
  submit: [data: PatientFormData];
  cancel: [];
}>();

export interface PatientFormData {
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;

  idType: string;
  idNumber: string;

  birthDate: string;
  gender: string;

  country: string;
  stateProvince: string;
  city: string;
  address: string;

  phone: string;
  email?: string;

  educationLevel: string;
  occupation: string;
}

const form = reactive<PatientFormData>({
  firstName: "",
  middleName: "",
  firstLastName: "",
  secondLastName: "",

  idType: "CEDULA",
  idNumber: "",

  birthDate: "",
  gender: "",

  country: "ECUADOR",
  stateProvince: "",
  city: "",
  address: "",

  phone: "",
  email: "",

  educationLevel: "",
  occupation: "",
});

const isEditing = computed(
  () => props.patient !== null && props.patient !== undefined,
);

watch(
  () => props.patient,
  (patient) => {
    if (patient) {
      form.firstName = patient.firstName;
      form.middleName = patient.middleName ?? "";
      form.firstLastName = patient.firstLastName;
      form.secondLastName = patient.secondLastName ?? "";

      form.idType = patient.idType;
      form.idNumber = patient.idNumber;

      form.birthDate = patient.birthDate ?? "";
      form.gender = patient.gender ?? "";

      form.country = patient.country ?? "";
      form.stateProvince = patient.stateProvince ?? "";
      form.city = patient.city ?? "";
      form.address = patient.address ?? "";

      form.phone = patient.phone;
      form.email = patient.email ?? "";

      form.educationLevel = patient.educationLevel ?? "";
      form.occupation = patient.occupation ?? "";
    } else {
      resetForm();
    }
  },
  {
    immediate: true,
  },
);

function resetForm() {
  form.firstName = "";
  form.middleName = "";
  form.firstLastName = "";
  form.secondLastName = "";

  form.idType = "CEDULA";
  form.idNumber = "";

  form.birthDate = "";
  form.gender = "";

  form.country = "ECUADOR";
  form.stateProvince = "";
  form.city = "";
  form.address = "";

  form.phone = "";
  form.email = "";

  form.educationLevel = "";
  form.occupation = "";
}

function handleSubmit() {
  if (
    !form.firstName.trim() ||
    !form.firstLastName.trim() ||
    !form.idType ||
    !form.idNumber.trim() ||
    !form.birthDate ||
    !form.gender ||
    !form.country.trim() ||
    !form.stateProvince.trim() ||
    !form.city.trim() ||
    !form.address.trim() ||
    !form.phone.trim() ||
    !form.educationLevel ||
    !form.occupation.trim()
  ) {
    return;
  }

  emit("submit", {
    ...form,
  });
}
</script>

<template>
  <section>
    <h2 class="section-title">
      {{ isEditing ? "Editar Paciente" : "Registrar Paciente" }}
    </h2>

    <form @submit.prevent="handleSubmit">
      <section class="form-section">
        <h3 class="section-title">Información Personal</h3>
        <div class="form-grid-4">
          <div class="form-field">
            <label>Primer Nombre</label>
            <input v-model="form.firstName" type="text" required />
          </div>

          <div class="form-field">
            <label>Segundo Nombre</label>
            <input v-model="form.middleName" type="text" />
          </div>

          <div class="form-field">
            <label>Primer Apellido</label>
            <input v-model="form.firstLastName" type="text" required />
          </div>
          <div class="form-field">
            <label>Segundo Apellido</label>
            <input v-model="form.secondLastName" type="text" />
          </div>
        </div>
        <div class="form-grid-4">
          <div class="form-field">
            <label>Tipo de identificación</label>
            <select v-model="form.idType">
              <option value="CEDULA">Cédula</option>
              <option value="PASAPORTE">Pasaporte</option>
              <option value="LICENCIA">Licencia</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          <div class="form-field">
            <label>Número de indentificación</label>
            <input v-model="form.idNumber" type="text" required />
          </div>
          <div class="form-field">
            <label>Fecha de nacimiemto</label>
            <input v-model="form.birthDate" type="date" required />
          </div>

          <div class="form-field">
            <label>Género</label>
            <select v-model="form.gender">
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="NO ESPECIFICADO">No especificado</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3 class="section-title">Ubicación y contacto</h3>
        <div class="form-grid-4">
          <div class="form-field">
            <label>País</label>
            <input v-model="form.country" type="text" required />
          </div>
          <div class="form-field">
            <label>Provincia</label>
            <input v-model="form.stateProvince" type="text" required />
          </div>
          <div class="form-field">
            <label>Ciudad</label>
            <input v-model="form.city" type="text" required />
          </div>
          <div class="form-field">
            <label>Dirección</label>
            <input v-model="form.address" type="text" required />
          </div>
        </div>
        <div class="form-grid-4">
          <div class="form-field">
            <label>Teléfono</label>
            <input v-model="form.phone" type="text" required />
          </div>
          <div class="form-field">
            <label>Ocupación</label>
            <input v-model="form.occupation" type="text" required />
          </div>
          <div class="form-field">
            <label>Nivel educativo</label>
            <select v-model="form.educationLevel">
              <option value="PRIMARIA INCOMPLETA">Primaria incompleta</option>
              <option value="SECUNDARIA INCOMPLETA">
                Secundaria incompleta
              </option>
              <option value="SUPERIOR INCOMPLETA">Superior incompleta</option>
              <option value="PRIMARIA COMPLETA">Primaria completa</option>
              <option value="SECUNDARIA COMPLETA">Secundaria completa</option>
              <option value="SUPERIOR COMPLETA">Superior completa</option>
              <option value="NINGUNA">Ninguna</option>
            </select>
          </div>
          <div class="form-field">
            <label>Correo</label>
            <input v-model="form.email" type="mail" />
          </div>
        </div>
      </section>
      <div class="actions">
        <button type="submit" class="btn-success">
          {{ isEditing ? "Actualizar" : "Guardar" }}
        </button>
        <button type="button" class="btn-secondary" @click="emit('cancel')">
          Cancelar
        </button>
      </div>
    </form>
  </section>
</template>
