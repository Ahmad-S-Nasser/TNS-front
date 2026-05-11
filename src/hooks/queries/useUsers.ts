// ─── User Management Queries ──────────────────────────────────────────────────
// Wraps all /admin/users/* API calls with TanStack Query.

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type { AdminAccount, PermissionOverride } from "@/rbac/rbac.types";

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
  governorateCode?: string;
  preferredLanguage: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

const KEYS = {
  all: ["admin-users"] as const,
  list: () => [...KEYS.all, "list"] as const,
  detail: (id: string) => [...KEYS.all, "detail", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useAdminUsers() {
  return useQuery({
    queryKey: KEYS.list(),
    queryFn: () => apiGet<AppUser[]>("/admin/users"),
  });
}

export function useAdminUser(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => apiGet<AdminAccount>(`/admin/users/${id}`),
    enabled: !!id,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<AdminAccount, "id" | "overrides" | "lastActive" | "joinedDate">) =>
      apiPost<AdminAccount>("/admin/users", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list() }),
  });
}

export function useUpdateAdminUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "inactive" | "suspended" }) =>
      apiPatch<AdminAccount>(`/admin/users/${id}`, { status }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.list() });
      qc.invalidateQueries({ queryKey: KEYS.detail(vars.id) });
    },
  });
}

export function useUpdatePermissionOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      targetAccountId,
      permission,
      action,
    }: {
      targetAccountId: string;
      permission: PermissionOverride["permission"];
      action: "grant" | "deny" | "reset";
    }) =>
      apiPatch<AdminAccount>(`/admin/users/${targetAccountId}/permissions`, {
        permission,
        action,
      }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.detail(vars.targetAccountId) });
      qc.invalidateQueries({ queryKey: KEYS.list() });
    },
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete(`/admin/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list() }),
  });
}
