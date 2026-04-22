// ─── Keycloak Auth Module ─────────────────────────────────────────────────────
// Uses Keycloak's Resource Owner Password Credentials (ROPC) flow for the
// admin panel. Token is stored in localStorage and attached to all API calls.
//
// Keycloak ROPC endpoint:
//   POST /auth/realms/{realm}/protocol/openid-connect/token
//   Content-Type: application/x-www-form-urlencoded
//   Body: grant_type=password&client_id=...&username=...&password=...

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL ?? "http://localhost:6080";
const REALM = import.meta.env.VITE_KEYCLOAK_REALM ?? "tips-steps";
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? "tns-admin";

const TOKEN_URL = `/auth/realms/${REALM}/protocol/openid-connect/token`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  realm_access?: { roles: string[] };
  resource_access?: Record<string, { roles: string[] }>;
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
  const realmRoles = payload.realm_access?.roles ?? [];
  const clientRoles = payload.resource_access?.[CLIENT_ID]?.roles ?? [];
  return {
    id: payload.sub,
    username: payload.preferred_username ?? "",
    email: payload.email ?? "",
    name: payload.name ?? `${payload.given_name ?? ""} ${payload.family_name ?? ""}`.trim(),
    roles: [...new Set([...realmRoles, ...clientRoles])],
  };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function keycloakLogin(username: string, password: string): Promise<AuthUser> {
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: CLIENT_ID,
    username,
    password,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message =
      (err as { error_description?: string }).error_description ??
      "Invalid username or password";
    throw new Error(message);
  }

  const data = (await res.json()) as TokenResponse;
  localStorage.setItem("tns_access_token", data.access_token);
  localStorage.setItem("tns_refresh_token", data.refresh_token);

  const payload = decodeJwt(data.access_token);
  if (!payload) throw new Error("Failed to parse token");

  const user = extractUser(payload);
  localStorage.setItem("tns_user", JSON.stringify(user));
  return user;
}

export async function keycloakRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem("tns_refresh_token");
  if (!refreshToken) return false;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as TokenResponse;
    localStorage.setItem("tns_access_token", data.access_token);
    localStorage.setItem("tns_refresh_token", data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export function keycloakLogout(): void {
  const token = localStorage.getItem("tns_access_token");
  localStorage.removeItem("tns_access_token");
  localStorage.removeItem("tns_refresh_token");
  localStorage.removeItem("tns_user");

  // Best-effort — notify Keycloak of logout
  if (token) {
    const payload = decodeJwt(token);
    if (payload) {
      fetch(`/auth/realms/${REALM}/protocol/openid-connect/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
        body: new URLSearchParams({ client_id: CLIENT_ID }),
      }).catch(() => undefined);
    }
  }
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
  return Date.now() / 1000 >= payload.exp - 30; // 30s buffer
}
