// ─── Custom Auth Module ───────────────────────────────────────────────────────
// Direct calls to UserManagement service via Gateway.
// Token is stored in localStorage and attached to all API calls.

const API_BASE_URL = "/api"; // Forwarded by Gateway
const LOGIN_URL = `${API_BASE_URL}/auth/login`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  userId?: string;
  email?: string;
  role?: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  role?: string | string[];
  firstName?: string;
  lastName?: string;
  exp: number;
  iat: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

// ─── JWT decoder (no library needed) ─────────────────────────────────────────

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function extractUser(payload: JwtPayload): AuthUser {
  const roles = Array.isArray(payload.role) ? payload.role : payload.role ? [payload.role] : [];
  return {
    id: payload.sub,
    username: payload.email?.split("@")[0] ?? "",
    email: payload.email ?? "",
    name: (`${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim() || payload.email) ?? "User",
    roles: roles,
  };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Invalid email or password");
  }

  const data = (await res.json()) as LoginResponse;
  if (!data.token) throw new Error("No token received from server");

  localStorage.setItem("tns_access_token", data.token);
  // No refresh token in this simplified custom implementation yet
  // localStorage.setItem("tns_refresh_token", data.refresh_token);

  const payload = decodeJwt(data.token);
  if (!payload) throw new Error("Failed to parse token");

  const user = extractUser(payload);
  localStorage.setItem("tns_user", JSON.stringify(user));
  return user;
}

export async function refreshToken(): Promise<boolean> {
  // Simplified: No refresh token logic implemented in custom provider yet
  return false;
}

export function logout(): void {
  localStorage.removeItem("tns_access_token");
  localStorage.removeItem("tns_refresh_token");
  localStorage.removeItem("tns_user");
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("tns_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem("tns_access_token");
}

export function isTokenExpired(): boolean {
  const token = getAccessToken();
  if (!token) return true;
  const payload = decodeJwt(token);
  if (!payload) return true;
  return Date.now() / 1000 >= payload.exp - 60; // 1 minute buffer
}
