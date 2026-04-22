// ─── Content Management Queries ───────────────────────────────────────────────
// Wraps all /admin/content/* API calls with TanStack Query.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type { CMSContent, CMSSection, ContentStatus } from "@/content-management/cms.types";

const KEYS = {
  all: ["content"] as const,
  list: (section?: CMSSection, status?: ContentStatus) =>
    [...KEYS.all, "list", section ?? "all", status ?? "all"] as const,
  detail: (id: string) => [...KEYS.all, "detail", id] as const,
  stats: () => [...KEYS.all, "stats"] as const,
};

interface ContentListParams {
  section?: CMSSection;
  status?: ContentStatus;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useContent({ section, status }: ContentListParams = {}) {
  const params = new URLSearchParams();
  if (section) params.set("section", section);
  if (status) params.set("status", status);
  const qs = params.toString();

  return useQuery({
    queryKey: KEYS.list(section, status),
    queryFn: () => apiGet<CMSContent[]>(`/admin/content${qs ? `?${qs}` : ""}`),
  });
}

export function useContentItem(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => apiGet<CMSContent>(`/admin/content/${id}`),
    enabled: !!id,
  });
}

export function useContentStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => apiGet<Record<string, number>>("/admin/content/stats"),
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CMSContent, "id" | "created_at" | "updated_at">) =>
      apiPost<CMSContent>("/admin/content", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CMSContent> }) =>
      apiPatch<CMSContent>(`/admin/content/${id}`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: KEYS.detail(vars.id) });
    },
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/content/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}

export function usePromoteContentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiPatch<CMSContent>(`/admin/content/${id}/status`, { status }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      qc.invalidateQueries({ queryKey: KEYS.detail(vars.id) });
    },
  });
}

export function useArchiveContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiPatch<CMSContent>(`/admin/content/${id}/status`, { status: "archived" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
