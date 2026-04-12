import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/AdminLayout";
import { I18nProvider } from "@/i18n/i18n.context";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

const App = () => (
  <I18nProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/questions" element={<AdminRoute><QuestionsPage /></AdminRoute>} />
            <Route path="/growth-matrix" element={<AdminRoute><GrowthMatrixPage /></AdminRoute>} />
            <Route path="/content" element={<AdminRoute><ContentManagement /></AdminRoute>} />
            <Route path="/analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
            <Route path="/audit-logs" element={<AdminRoute><AuditLogs /></AdminRoute>} />
            <Route path="/roles" element={<AdminRoute><RolesPermissions /></AdminRoute>} />
            <Route path="/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
            <Route path="/support" element={<AdminRoute><PlaceholderPage title="Support" description="Contact support or review system tickets." /></AdminRoute>} />
            <Route path="/doctors" element={<AdminRoute><PlaceholderPage title="Doctors" description="Manage doctor accounts and assignments." /></AdminRoute>} />
            <Route path="/marketing" element={<AdminRoute><PlaceholderPage title="Marketing" description="Marketing team tools and content campaigns." /></AdminRoute>} />
            <Route path="/it-support" element={<AdminRoute><PlaceholderPage title="IT Support" description="System health, error logs, and user troubleshooting." /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </I18nProvider>
);

export default App;
