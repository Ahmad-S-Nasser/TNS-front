// ─── Growth Matrix Queries ────────────────────────────────────────────────────
// Wraps all /admin/growth/* API calls with TanStack Query.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type {
  AgeGroup, GrowthCategory, Skill, ExpectedRule,
  AgeGroupFormData, CategoryFormData, SkillFormData, RuleFormData,
} from "@/growth-matrix/types";

const KEYS = {
  ageGroups: ["growth", "age-groups"] as const,
  categories: ["growth", "categories"] as const,
  skills: ["growth", "skills"] as const,
  skillsByCategory: (id: string) => ["growth", "skills", "category", id] as const,
  rules: ["growth", "rules"] as const,
  rulesByAgeGroup: (id: string) => ["growth", "rules", "age-group", id] as const,
  stats: ["growth", "stats"] as const,
};

// ─── Age Groups ───────────────────────────────────────────────────────────────

export function useAgeGroups() {
  return useQuery({
    queryKey: KEYS.ageGroups,
    queryFn: () => apiGet<AgeGroup[]>("/admin/growth/age-groups"),
  });
}

export function useCreateAgeGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AgeGroupFormData) =>
      apiPost<AgeGroup>("/admin/growth/age-groups", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ageGroups }),
  });
}

export function useUpdateAgeGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AgeGroupFormData> }) =>
      apiPatch<AgeGroup>(`/admin/growth/age-groups/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.ageGroups }),
  });
}

export function useDeleteAgeGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/growth/age-groups/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.ageGroups });
      qc.invalidateQueries({ queryKey: KEYS.rules });
    },
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useGrowthCategories() {
  return useQuery({
    queryKey: KEYS.categories,
    queryFn: () => apiGet<GrowthCategory[]>("/admin/growth/categories"),
  });
}

export function useCreateGrowthCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategoryFormData) =>
      apiPost<GrowthCategory>("/admin/growth/categories", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.categories }),
  });
}

export function useUpdateGrowthCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryFormData> }) =>
      apiPatch<GrowthCategory>(`/admin/growth/categories/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.categories }),
  });
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export function useSkills(categoryId?: string) {
  const url = categoryId
    ? `/admin/growth/skills?categoryId=${categoryId}`
    : "/admin/growth/skills";
  return useQuery({
    queryKey: categoryId ? KEYS.skillsByCategory(categoryId) : KEYS.skills,
    queryFn: () => apiGet<Skill[]>(url),
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SkillFormData) =>
      apiPost<Skill>("/admin/growth/skills", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.skills });
    },
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SkillFormData> }) =>
      apiPatch<Skill>(`/admin/growth/skills/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.skills }),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/growth/skills/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.skills });
      qc.invalidateQueries({ queryKey: KEYS.rules });
    },
  });
}

// ─── Rules ────────────────────────────────────────────────────────────────────

export function useRules(ageGroupId?: string) {
  const url = ageGroupId
    ? `/admin/growth/rules?ageGroupId=${ageGroupId}`
    : "/admin/growth/rules";
  return useQuery({
    queryKey: ageGroupId ? KEYS.rulesByAgeGroup(ageGroupId) : KEYS.rules,
    queryFn: () => apiGet<ExpectedRule[]>(url),
  });
}

export function useSaveRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RuleFormData) =>
      apiPost<ExpectedRule>("/admin/growth/rules", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.rules }),
  });
}

export function useDeleteRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/growth/rules/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.rules }),
  });
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export function useGrowthStats() {
  return useQuery({
    queryKey: KEYS.stats,
    queryFn: () => apiGet<Record<string, unknown>>("/admin/growth/stats"),
  });
}
