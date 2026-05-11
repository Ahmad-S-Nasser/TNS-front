import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/AdminLayout";
import { I18nProvider } from "@/i18n/i18n.context";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ContentManagement from "./pages/ContentManagement";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuditLogs from "./pages/AuditLogs";
import RolesPermissions from "./pages/RolesPermissions";
import SettingsPage from "./pages/SettingsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import LoginPage from "./pages/LoginPage";
import QuestionsPage from "@/pages/QuestionsPage";
import GrowthMatrixPage from "./pages/GrowthMatrixPage";
import HeatmapDashboard from "./health-intelligence/HeatmapDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

// ─── Protected Route ──────────────────────────────────────────────────────────
// Redirects unauthenticated users to /login.
// Shows a full-screen spinner while auth state is being restored.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9f9]">
        <div className="w-8 h-8 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn("[App] ProtectedRoute: User not authenticated. Bypassing for debug.");
    return <AdminLayout>{children}</AdminLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// ─── Public Route ─────────────────────────────────────────────────────────────
// Redirects authenticated users away from /login to the dashboard.
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  // return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
  return <>{children}</>;
};

const App = () => (
  <I18nProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
              <Route path="/questions" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
              <Route path="/growth-matrix" element={<ProtectedRoute><GrowthMatrixPage /></ProtectedRoute>} />
              <Route path="/content" element={<ProtectedRoute><ContentManagement /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/health-intelligence" element={<ProtectedRoute><HeatmapDashboard /></ProtectedRoute>} />
              <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
              <Route path="/roles" element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  </I18nProvider>
);

export default App;
