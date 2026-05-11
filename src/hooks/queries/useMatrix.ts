// ─── Growth Matrix Queries ───────────────────────────────────────────────────
// Wraps all /admin/growth/* API calls with TanStack Query.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type { 
  AgeGroup, 
  GrowthCategory, 
  Skill, 
  ExpectedRule, 
  AgeGroupFormData, 
  CategoryFormData, 
  SkillFormData, 
  RuleFormData 
} from "@/growth-matrix/types";

const KEYS = {
  all: ["matrix"] as const,
  ageGroups: () => [...KEYS.all, "age-groups"] as const,
  categories: () => [...KEYS.all, "categories"] as const,
  skills: (categoryId?: string) => [...KEYS.all, "skills", categoryId ?? "all"] as const,
  rules: (ageGroupId?: string, skillId?: string) => [...KEYS.all, "rules", ageGroupId ?? "all", skillId ?? "all"] as const,
  stats: () => [...KEYS.all, "stats"] as const,
};

// ─── Age Groups ──────────────────────────────────────────────────────────────

export function useAgeGroups() {
  return useQuery({
    queryKey: KEYS.ageGroups(),
    queryFn: () => apiGet<AgeGroup[]>("/admin/growth/age-groups"),
  });
}

export function useCreateAgeGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AgeGroupFormData) => apiPost<AgeGroup>("/admin/growth/age-groups", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ageGroups() }),
  });
}

export function useUpdateAgeGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AgeGroupFormData> }) =>
      apiPatch<AgeGroup>(`/admin/growth/age-groups/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ageGroups() }),
  });
}

export function useDeleteAgeGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/growth/age-groups/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ageGroups() }),
  });
}

// ─── Categories ──────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: KEYS.categories(),
    queryFn: () => apiGet<GrowthCategory[]>("/admin/growth/categories"),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryFormData) => apiPost<GrowthCategory>("/admin/growth/categories", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.categories() }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryFormData> }) =>
      apiPatch<GrowthCategory>(`/admin/growth/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.categories() }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/growth/categories/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.categories() }),
  });
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export function useSkills(categoryId?: string) {
  const qs = categoryId ? `?categoryId=${categoryId}` : "";
  return useQuery({
    queryKey: KEYS.skills(categoryId),
    queryFn: () => apiGet<Skill[]>(`/admin/growth/skills${qs}`),
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SkillFormData) => apiPost<Skill>("/admin/growth/skills", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.skills() }),
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillFormData> }) =>
      apiPatch<Skill>(`/admin/growth/skills/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.skills() }),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/growth/skills/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.skills() }),
  });
}

// ─── Rules ───────────────────────────────────────────────────────────────────

export function useRules(ageGroupId?: string, skillId?: string) {
  const params = new URLSearchParams();
  if (ageGroupId) params.set("ageGroupId", ageGroupId);
  if (skillId) params.set("skillId", skillId);
  const qs = params.toString();

  return useQuery({
    queryKey: KEYS.rules(ageGroupId, skillId),
    queryFn: () => apiGet<ExpectedRule[]>(`/admin/growth/rules${qs ? `?${qs}` : ""}`),
  });
}

export function useCreateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RuleFormData) => apiPost<ExpectedRule>("/admin/growth/rules", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.rules() }),
  });
}

export function useUpdateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RuleFormData> }) =>
      apiPatch<ExpectedRule>(`/admin/growth/rules/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.rules() }),
  });
}

export function useDeleteRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/growth/rules/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.rules() }),
  });
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export function useMatrixStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => apiGet<any>("/admin/growth/stats"),
  });
}
