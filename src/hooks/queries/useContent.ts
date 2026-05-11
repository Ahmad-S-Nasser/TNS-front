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

// ─── Mapping Utility ─────────────────────────────────────────────────────────

function mapBackendToFrontend(item: any): CMSContent {
  return {
    ...item,
    id: item.id,
    section: item.section?.toLowerCase() || "behavioral",
    title_ar: item.titleAr || item.title_ar || "",
    title_en: item.titleEn || item.title_en || "",
    description_ar: item.bodyAr || item.description_ar || "",
    description_en: item.bodyEn || item.description_en || "",
    status: item.status?.toLowerCase() || "draft",
    created_at: item.createdAt || item.created_at,
    updated_at: item.updatedAt || item.updated_at,
    published_at: item.publishedAt || item.published_at,
    created_by: item.authorId || item.created_by || "system",
    tags: item.tags || [],
    visibility: item.visibility || { 
        age_categories: item.minAgeMonths === 0 && item.maxAgeMonths === 36 ? ["all"] : [], 
        requires_login: false 
    },
    ...item.metadata
  } as CMSContent;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useContent({ section, status }: ContentListParams = {}) {
  const params = new URLSearchParams();
  if (section) params.set("section", section);
  if (status) params.set("status", status);
  const qs = params.toString();

  return useQuery({
    queryKey: KEYS.list(section, status),
    queryFn: async () => {
      const data = await apiGet<any[]>(`/admin/content${qs ? `?${qs}` : ""}`);
      return data.map(mapBackendToFrontend);
    },
  });
}

export function useContentItem(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: async () => {
      const data = await apiGet<any>(`/admin/content/${id}`);
      return mapBackendToFrontend(data);
    },
    enabled: !!id,
  });
}

export function useContentStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => apiGet<any>("/admin/content/stats"),
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
      apiPatch<CMSContent>(`/admin/content/${id}/status`, { id, status }),
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
      apiPatch<CMSContent>(`/admin/content/${id}/status`, { id, status: "archived" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.all }),
  });
}
