<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth.store";
import PatientForm from "../components/PatientForm.vue";
import type { PatientFormData } from "../components/PatientForm.vue";
import {
  createPatient,
  updatePatient,
  deletePatient,
  getPatients,
  type Patient,
} from "../services/patient.service";

const authStore = useAuthStore();

const patients = ref<Patient[]>([]);
const selectedPatient = ref<Patient | null>(null);
const search = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const showForm = ref(false);
const patientToEdit = ref<Patient | null>(null);

const filteredPatients = computed(() => {
  const term = search.value.trim();

  if (!term) {
    return patients.value;
  }

  return patients.value.filter((patient) => patient.idNumber.includes(term));
});

function selectPatient(patient: Patient) {
  selectedPatient.value = patient;
}

async function loadPatients() {
  loading.value = true;
  error.value = null;

  try {
    patients.value = await getPatients();
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

async function handleDelete() {
  if (!selectedPatient.value) {
    return;
  }

  const patientToDelete = selectedPatient.value;

  const confirmed = window.confirm(
    `¿Eliminar a ${patientToDelete.firstName} ${patientToDelete.middleName ?? ""} ${patientToDelete.firstLastName} ${patientToDelete.secondLastName ?? ""}?`,
  );

  if (!confirmed) {
    return;
  }

  try {
    error.value = null;

    await deletePatient(patientToDelete.id);

    patients.value = patients.value.filter(
      (patient) => patient.id !== patientToDelete.id,
    );

    selectedPatient.value = null;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Error desconocido";
    }
  }
}

async function handleCreate() {
  patientToEdit.value = null;
  showForm.value = true;
}

async function handleEdit() {
  if (!selectedPatient.value) return;

  patientToEdit.value = selectedPatient.value;
  showForm.value = true;
}

async function handlePatientSubmit(data: PatientFormData) {
  try {
    error.value = null;

    if (patientToEdit.value) {
      const updatedPatient = await updatePatient(patientToEdit.value.id, data);

      const index = patients.value.findIndex(
        (patient) => patient.id === updatedPatient.id,
      );

      if (index !== -1) {
        patients.value[index] = updatedPatient;
      }

      selectedPatient.value = updatedPatient;
    } else {
      const newPatient = await createPatient(data);

      patients.value.push(newPatient);
    }

    showForm.value = false;
    patientToEdit.value = null;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = "Error desconocido";
    }
  }
}

onMounted(() => {
  loadPatients();
});
</script>

<template>
  <section class="card">
    <h1>Pacientes</h1>

    <label for="search">Número de identificación</label>
    <input
      id="search"
      v-model="search"
      type="text"
      placeholder="Buscar paciente"
    />

    <p v-if="loading">Cargando pacientes</p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <p v-else-if="filteredPatients.length === 0">
      No se encontraron pacientes.
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Identificación</th>
          <th>Teléfono</th>
          <th>Correo</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="patient in filteredPatients"
          :key="patient.id"
          :class="{ selected: selectedPatient?.id === patient.id }"
          @click="selectPatient(patient)"
        >
          <td>
            {{ patient.firstName }}
            {{ patient.middleName ?? "" }}
            {{ patient.firstLastName }}
            {{ patient.secondLastName ?? "" }}
          </td>

          <td>
            {{ patient.idType }}
            {{ patient.idNumber }}
          </td>

          <td>{{ patient.phone }}</td>
          <td>{{ patient.email ?? "No registrado" }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedPatient" class="actions">
      <strong>
        Seleccionado:
        {{ selectedPatient.firstName }}
        {{ selectedPatient.middleName ?? "" }}
        {{ selectedPatient.firstLastName }}
        {{ selectedPatient.secondLastName ?? "" }}
      </strong>

      <button
        v-if="
          authStore.user?.role === 'ADMIN' ||
          authStore.user?.role === 'RECEPTIONIST'
        "
        type="button"
        @click="handleEdit"
      >
        Editar
      </button>

      <button
        v-if="authStore.user?.role === 'ADMIN'"
        type="button"
        @click="handleDelete"
      >
        Eliminar
      </button>
    </div>

    <div>
      <button
        v-if="
          authStore.user?.role === 'ADMIN' ||
          authStore.user?.role === 'RECEPTIONIST'
        "
        type="button"
        @click="handleCreate"
      >
        Nuevo Paciente
      </button>
    </div>
    <PatientForm
      v-if="showForm"
      :patient="patientToEdit"
      @submit="handlePatientSubmit"
      @cancel="showForm = false"
    />
  </section>
</template>
