// ─── Health Intelligence Queries ──────────────────────────────────────────────
// Wraps /admin/health-intel/* API calls with TanStack Query.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api-client";

export interface SignalPoint {
  region: string;
  governorate: string;
  lat: number;
  lng: number;
  signalType: string;
  count: number;
  severity: "low" | "medium" | "high" | "critical";
  date: string;
}

export interface HealthSignalFilters {
  region?: string;
  signalType?: string;
  dateFrom?: string;
  dateTo?: string;
  severity?: string;
}

export interface ReportRequest {
  title: string;
  filters: HealthSignalFilters;
  format: "pdf" | "csv" | "json";
}

const KEYS = {
  signals: (filters: HealthSignalFilters) => ["health-intel", "signals", filters] as const,
  heatmap: (filters: HealthSignalFilters) => ["health-intel", "heatmap", filters] as const,
  trends: ["health-intel", "trends"] as const,
  liveSignals: ["health-intel", "live"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useHealthSignals(filters: HealthSignalFilters = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => !!v) as string[][]
  ).toString();

  return useQuery({
    queryKey: KEYS.signals(filters),
    queryFn: () =>
      apiGet<SignalPoint[]>(`/admin/health-intel/signals${params ? `?${params}` : ""}`),
    staleTime: 30_000,
  });
}

export function useHeatmapData(filters: HealthSignalFilters = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => !!v) as string[][]
  ).toString();

  return useQuery({
    queryKey: KEYS.heatmap(filters),
    queryFn: () =>
      apiGet<SignalPoint[]>(`/admin/health-intel/heatmap${params ? `?${params}` : ""}`),
    staleTime: 60_000,
  });
}

export function useHealthTrends() {
  return useQuery({
    queryKey: KEYS.trends,
    queryFn: () =>
      apiGet<{ metric: string; data: { date: string; value: number }[] }[]>(
        "/admin/health-intel/trends"
      ),
  });
}

export function useLiveSignals() {
  return useQuery({
    queryKey: KEYS.liveSignals,
    queryFn: () => apiGet<SignalPoint[]>("/admin/health-intel/signals/live"),
    refetchInterval: 15_000, // auto-refresh every 15s
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useGenerateReport() {
  return useMutation({
    mutationFn: (request: ReportRequest) =>
      apiPost<{ downloadUrl: string }>("/admin/health-intel/reports", request),
  });
}
