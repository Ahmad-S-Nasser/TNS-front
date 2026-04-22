// ─── Axios API Client ─────────────────────────────────────────────────────────
// All requests go through the Vite proxy → YARP Gateway → microservices.
// Base URL: /api  (proxied to http://localhost:6000 in dev)

import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ─── Request interceptor — attach Bearer token ────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("tns_access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — handle auth errors ────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem("tns_access_token");
      localStorage.removeItem("tns_refresh_token");
      localStorage.removeItem("tns_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Typed response helper ────────────────────────────────────────────────────
export async function apiGet<T>(url: string): Promise<T> {
  const res = await apiClient.get<T>(url);
  return res.data;
}

export async function apiPost<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await apiClient.post<T>(url, body);
  return res.data;
}

export async function apiPatch<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await apiClient.patch<T>(url, body);
  return res.data;
}

export async function apiPut<T, B = unknown>(url: string, body?: B): Promise<T> {
  const res = await apiClient.put<T>(url, body);
  return res.data;
}

export async function apiDelete<T = void>(url: string): Promise<T> {
  const res = await apiClient.delete<T>(url);
  return res.data;
}
