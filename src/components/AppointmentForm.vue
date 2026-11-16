<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import type { Patient } from "../services/patient.service";
import type { Doctor } from "../services/users.service";
import type {
  CreateAppointmentRequest,
  AppointmentType,
} from "../services/appointment.service";
import {
  AvailabilitySlot,
  DoctorAvailability,
  getDoctorAvailability,
} from "../services/doctorSchedule.service";

const props = defineProps<{
  patients: Patient[];
  doctors: Doctor[];
}>();

const emit = defineEmits<{
  submit: [data: CreateAppointmentRequest];
}>();

const patientSearch = ref("");
const selectedDate = ref("");
const availableSlots = ref<AvailabilitySlot[]>([]);
const loadingAvailability = ref(false);
const availabilityError = ref<string | null>(null);
const minDate = new Date().toLocaleDateString("en-CA", {
  timeZone: "America/Guayaquil",
});
let availabilityController: AbortController | null = null;

async function loadAvailability() {
  availabilityController?.abort();

  availabilityController = new AbortController();

  loadingAvailability.value = true;
  availabilityError.value = null;

  try {
    const availability = await getDoctorAvailability(
      form.doctorId,
      selectedDate.value,
      form.appointmentType,
      availabilityController.signal,
    );

    availableSlots.value = availability.slots;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return;
    }

    if (err instanceof Error) {
      availabilityError.value = err.message;
    } else {
      availabilityError.value = "Error desconocido al consultar disponibilidad";
    }
  } finally {
    loadingAvailability.value = false;
  }
}

const filteredPatients = computed(() => {
  const term = patientSearch.value.trim();

  if (!term) return [];

  return props.patients.filter((patient) => patient.idNumber.includes(term));
});

const selectedPatient = computed(() =>
  props.patients.find((patient) => patient.id === form.patientId),
);

const form = reactive({
  patientId: "",
  doctorId: "",
  appointmentType: "SEGUIMIENTO" as AppointmentType,
  startAt: "",
  reason: "",
});

function handleSubmit() {
  if (
    !form.patientId ||
    !form.doctorId ||
    !form.appointmentType ||
    !form.startAt
  ) {
    return;
  }

  const data: CreateAppointmentRequest = {
    patientId: form.patientId,
    doctorId: form.doctorId,
    appointmentType: form.appointmentType,
    startAt: form.startAt,
    reason: form.reason || undefined,
  };

  emit("submit", data);
  resetForm();
}

function resetForm() {
  form.patientId = "";
  form.doctorId = "";
  form.appointmentType = "SEGUIMIENTO";
  form.startAt = "";
  form.reason = "";
}

function formatSlotTime(startAt: string) {
  return new Date(startAt).toLocaleTimeString("es-EC", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

watch(
  [() => form.doctorId, () => selectedDate.value, () => form.appointmentType],
  async ([doctorId, date, appointmentType]) => {
    form.startAt = "";
    availableSlots.value = [];
    availabilityError.value = null;

    if (!doctorId || !date || !appointmentType) {
      return;
    }

    await loadAvailability();
  },
);
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h2 class="section-title">Agendamiento de Citas</h2>
    <div>
      <div class="form-field">
        <label for="patient">Paciente</label>
        <input
          id="patientSearch"
          v-model="patientSearch"
          type="text"
          placeholder="Identificación"
        />
      </div>
      <div v-if="filteredPatients.length" class="actions">
        <button
          v-for="patient in filteredPatients"
          :key="patient.id"
          type="button"
          class="patient-option"
          @click="form.patientId = patient.id"
        >
          {{ patient.firstName }} {{ patient.middleName ?? "" }}
          {{ patient.firstLastName }}
          {{ patient.secondLastName ?? "" }}
          ---
          {{ patient.idNumber }}
        </button>
      </div>
    </div>

    <div v-if="selectedPatient" class="selected-patient-card">
      <strong>
        {{ selectedPatient.firstName }} {{ selectedPatient.middleName ?? "" }}
        {{ selectedPatient.firstLastName }}
        {{ selectedPatient.secondLastName ?? "" }}
      </strong>

      <p>
        {{ selectedPatient.idType }}
        {{ selectedPatient.idNumber }}
      </p>
    </div>

    <div class="form-grid-3">
      <div class="form-field">
        <label for="doctor">Doctor</label>
        <select id="doctor" v-model="form.doctorId" required>
          <option value="">Seleccione un doctor</option>
          <option
            v-for="doctor in props.doctors"
            :key="doctor.id"
            :value="doctor.id"
          >
            {{ doctor.fullName }}
          </option>
        </select>
      </div>

      <div class="form-field">
        <label for="appointmentType">Tipo de Cita</label>
        <select id="appointmentType" v-model="form.appointmentType" required>
          <option value="PRIMERA VEZ">Primera vez</option>
          <option value="SEGUIMIENTO">Seguimiento</option>
        </select>
      </div>

      <div class="form-field">
        <label for="appointment-date"> Fecha </label>
        <input
          id="appointment-date"
          v-model="selectedDate"
          type="date"
          :min="minDate"
        />

        <p v-if="loadingAvailability">Consultando horarios disponibles</p>

        <p v-else-if="availabilityError">
          {{ availabilityError }}
        </p>

        <p
          v-else-if="
            form.doctorId && selectedDate && availableSlots.length === 0
          "
        >
          No existen horarios disponibles para esta fecha.
        </p>

        <div v-if="availableSlots.length > 0">
          <label for="appointment-time"> Horario disponible </label>

          <select id="appointment-time" v-model="form.startAt">
            <option value="">Seleccione un horario</option>

            <option
              v-for="slot in availableSlots"
              :key="slot.startAt"
              :value="slot.startAt"
            >
              {{ formatSlotTime(slot.startAt) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <label for="reason">Motivo</label>
      <textarea id="reason" v-model="form.reason" />
    </div>

    <div class="actions">
      <button type="submit" class="btn-success">Reservar cita</button>
      <button type="button" class="btn-secondary" @click="resetForm">
        Limpiar
      </button>
    </div>
  </form>
</template>
