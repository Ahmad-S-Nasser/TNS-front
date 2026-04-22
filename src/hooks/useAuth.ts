// ─── Auth Context ──────────────────────────────────────────────────────────────
// Provides: user, isAuthenticated, isLoading, login(), logout()
// to the entire app via <AuthProvider>.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  keycloakLogin,
  keycloakLogout,
  keycloakRefresh,
  getStoredUser,
  isTokenExpired,
  type AuthUser,
} from "@/lib/keycloak";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount — try to restore session from localStorage
  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = getStoredUser();
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      if (isTokenExpired()) {
        // Try to silently refresh
        const refreshed = await keycloakRefresh();
        if (refreshed) {
          setUser(getStoredUser());
        } else {
          keycloakLogout();
        }
      } else {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  // Auto-refresh token 5 minutes before expiry
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      if (isTokenExpired()) {
        const refreshed = await keycloakRefresh();
        if (!refreshed) {
          setUser(null);
          keycloakLogout();
          window.location.href = "/login";
        }
      }
    }, 60_000); // check every minute

    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(async (username: string, password: string) => {
    const authUser = await keycloakLogin(username, password);
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    keycloakLogout();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const hasRole = useCallback(
    (role: string) => user?.roles.includes(role) ?? false,
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
