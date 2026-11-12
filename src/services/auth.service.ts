import type { UserRole } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface AuthUser {
  id: string;
  userName: string;
  role: UserRole;
}

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const data = await response.json();
    return data?.message ?? fallback;
  } catch {
    return fallback;
  }
}

export async function login(credentials: LoginCredentials): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Error al iniciar sesión"));
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Sesión no válida");
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al cerrar sesión");
  }
}
