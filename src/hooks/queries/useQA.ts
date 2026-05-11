import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api-client";

export interface Question {
  id: string;
  parentId: string;
  assignedDoctorId?: string;
  category: string;
  questionTextAr: string;
  questionTextEn?: string;
  isAnonymous: boolean;
  status: string;
  submittedAt: string;
  answeredAt?: string;
  answer?: {
    doctorId: string;
    answerText: string;
    answeredAt: string;
  };
}

const KEYS = {
  all: ["qa"] as const,
  questions: () => [...KEYS.all, "questions"] as const,
};

export function useQuestions() {
  return useQuery({
    queryKey: KEYS.questions(),
    queryFn: () => apiGet<Question[]>("/admin/qa/questions"),
  });
}

export function useAnswerQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, doctorId, answerText }: { id: string; doctorId: string; answerText: string }) =>
      apiPost(`/admin/qa/questions/${id}/answer`, { doctorId, answerText }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.questions() }),
  });
}
