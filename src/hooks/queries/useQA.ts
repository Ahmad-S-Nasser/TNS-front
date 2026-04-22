// ─── QA Queries ───────────────────────────────────────────────────────────────
// Wraps /admin/qa/* API calls with TanStack Query.
// Covers: FAQs + Questionnaires

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type { FAQ } from "@/faqs/faq.types";
import type { Questionnaire } from "@/questionnaires/questionnaire.types";

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
  faqs: ["qa", "faqs"] as const,
  faqDetail: (id: string) => ["qa", "faqs", id] as const,
  questionnaires: ["qa", "questionnaires"] as const,
  questionnaireDetail: (id: string) => ["qa", "questionnaires", id] as const,
};

// ─── FAQ Queries ──────────────────────────────────────────────────────────────

export function useFAQs() {
  return useQuery({
    queryKey: KEYS.faqs,
    queryFn: () => apiGet<FAQ[]>("/admin/qa/faqs"),
  });
}

export function useCreateFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<FAQ, "id" | "createdAt" | "updatedAt">) =>
      apiPost<FAQ>("/admin/qa/faqs", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.faqs }),
  });
}

export function useUpdateFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FAQ> }) =>
      apiPatch<FAQ>(`/admin/qa/faqs/${id}`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.faqs });
      qc.invalidateQueries({ queryKey: KEYS.faqDetail(vars.id) });
    },
  });
}

export function useDeleteFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/qa/faqs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.faqs }),
  });
}

// ─── Questionnaire Queries ────────────────────────────────────────────────────

export function useQuestionnaires() {
  return useQuery({
    queryKey: KEYS.questionnaires,
    queryFn: () => apiGet<Questionnaire[]>("/admin/qa/questionnaires"),
  });
}

export function useCreateQuestionnaire() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Questionnaire, "id" | "createdAt" | "updatedAt">) =>
      apiPost<Questionnaire>("/admin/qa/questionnaires", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.questionnaires }),
  });
}

export function useUpdateQuestionnaire() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Questionnaire> }) =>
      apiPatch<Questionnaire>(`/admin/qa/questionnaires/${id}`, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.questionnaires });
      qc.invalidateQueries({ queryKey: KEYS.questionnaireDetail(vars.id) });
    },
  });
}

export function useDeleteQuestionnaire() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/qa/questionnaires/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.questionnaires }),
  });
}
