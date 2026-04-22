// ─── Analytics Queries ────────────────────────────────────────────────────────
// Wraps /admin/analytics/* API calls with TanStack Query.

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";

export interface DashboardKPIs {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  publishedContent: number;
  pendingReview: number;
  totalQuestionnaires: number;
  totalResponses: number;
  healthSignals: number;
}

export interface TrendPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsTrend {
  metric: string;
  data: TrendPoint[];
}

const KEYS = {
  kpis: ["analytics", "kpis"] as const,
  trends: (metric: string, days: number) => ["analytics", "trends", metric, days] as const,
  auditLogs: ["analytics", "audit-logs"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useDashboardKPIs() {
  return useQuery({
    queryKey: KEYS.kpis,
    queryFn: () => apiGet<DashboardKPIs>("/admin/analytics/kpis"),
    staleTime: 60_000, // refresh every minute
  });
}

export function useAnalyticsTrends(metric: string, days = 30) {
  return useQuery({
    queryKey: KEYS.trends(metric, days),
    queryFn: () => apiGet<AnalyticsTrend>(`/admin/analytics/trends?metric=${metric}&days=${days}`),
    enabled: !!metric,
  });
}

export function useAuditLogs(page = 1, limit = 50) {
  return useQuery({
    queryKey: [...KEYS.auditLogs, page, limit],
    queryFn: () =>
      apiGet<{ items: unknown[]; total: number }>(
        `/admin/analytics/audit-logs?page=${page}&limit=${limit}`
      ),
  });
}
