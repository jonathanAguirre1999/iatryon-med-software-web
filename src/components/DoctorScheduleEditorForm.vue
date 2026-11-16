<script setup lang="ts">
import { ref, watch } from "vue";
import {
  getDoctorSchedules,
  DoctorSchedule,
  setDoctorSchedule,
  ScheduleBlock,
} from "../services/doctorSchedule.service";

const props = defineProps<{
  doctorId: string;
}>();

const schedules = ref<DoctorSchedule[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedDay = ref<number | null>(null);
const editingBlocks = ref<ScheduleBlock[]>([]);

const days = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
];

async function loadSchedules() {
  loading.value = true;
  error.value = null;

  try {
    schedules.value = await getDoctorSchedules(props.doctorId);
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Error al cargar los horarios";
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.doctorId,
  async () => {
    await loadSchedules();
  },
  { immediate: true },
);

function getScheduleForDay(day: number) {
  return schedules.value.find((schedule) => schedule.dayOfWeek === day);
}

function startAdd(day: number) {
  selectedDay.value = day;
  editingBlocks.value = [
    {
      start: "",
      end: "",
    },
  ];
}

function startEdit(day: number) {
  const schedule = getScheduleForDay(day);

  if (!schedule) return;

  selectedDay.value = day;

  editingBlocks.value = schedule.blocks.map((block) => ({
    start: block.start,
    end: block.end,
  }));
}

function addBlock() {
  editingBlocks.value.push({
    start: "",
    end: "",
  });
}

function removeBlock(index: number) {
  editingBlocks.value.splice(index, 1);
}

function cancelEditing() {
  selectedDay.value = null;
  editingBlocks.value = [];
}

async function saveSchedule() {
  if (selectedDay.value === null) return;

  error.value = null;

  try {
    const updatedSchedule = await setDoctorSchedule(
      props.doctorId,
      selectedDay.value,
      editingBlocks.value,
    );

    const index = schedules.value.findIndex(
      (schedule) => schedule.dayOfWeek === selectedDay.value,
    );

    if (index !== -1) {
      schedules.value[index] = updatedSchedule;
    } else {
      schedules.value.push(updatedSchedule);
    }

    cancelEditing();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "Error al guardar el horario";
  }
}
</script>

<template>
  <section>
    <h2>Horario de la semana</h2>

    <p v-if="loading">Cargando horarios</p>

    <p v-else-if="error">{{ error }}</p>

    <div v-else>
      <div v-for="day in days" :key="day.value" class="schedule-day">
        <strong>{{ day.label }}</strong>

        <div class="schedule-blocks">
          <template v-if="getScheduleForDay(day.value)">
            <span
              v-for="block in getScheduleForDay(day.value)!.blocks"
              :key="`${block.start}-${block.end}`"
            >
              {{ block.start }} - {{ block.end }}
            </span>
          </template>

          <span v-else>Sin horario</span>
        </div>

        <button
          type="button"
          class="btn-secondary"
          @click="
            getScheduleForDay(day.value)
              ? startEdit(day.value)
              : startAdd(day.value)
          "
        >
          {{ getScheduleForDay(day.value) ? "Editar" : "Agregar" }}
        </button>

        <div v-if="selectedDay === day.value" class="schedule-editor">
          <h4>Editar horario: {{ day.label }}</h4>

          <div
            v-for="(block, index) in editingBlocks"
            :key="index"
            class="schedule-editor-block"
          >
            <input v-model="block.start" type="time" />
            <input v-model="block.end" type="time" />

            <button
              type="button"
              class="btn-danger"
              @click="removeBlock(index)"
            >
              Eliminar
            </button>
          </div>

          <div class="schedule-editor-actions">
            <button type="button" class="btn-secondary" @click="addBlock">
              Agregar bloque
            </button>

            <button type="button" class="btn-success" @click="saveSchedule">
              Guardar
            </button>

            <button type="button" class="btn-warning" @click="cancelEditing">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
