import type { PatientFormData } from "../components/PatientForm.vue";

const API_URL = import.meta.env.VITE_API_URL;

export interface Patient {
  id: string;

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

  isActive: boolean;
}

export async function getPatients(): Promise<Patient[]> {
  const response = await fetch(`${API_URL}/api/patients`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener pacientes");
  }

  return response.json();
}

export async function createPatient(data: PatientFormData): Promise<Patient> {
  const response = await fetch(`${API_URL}/api/patients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (response.status !== 201) {
    let message = "Error al registrar";
    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export async function updatePatient(
  id: string,
  data: PatientFormData,
): Promise<Patient> {
  const response = await fetch(`${API_URL}/api/patients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = "Error al actualizar";
    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

export async function deletePatient(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/patients/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.status !== 204) {
    throw new Error("Error al eliminar");
  }
}
