import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9f9] p-4 font-sans">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <img src="/favicon.png" className="w-16 h-16 object-contain rounded-2xl mb-5 shadow-lg shadow-teal-500/10" alt="Logo" />
          <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight mb-1">Tips &amp; Steps</h1>
          <p className="text-[15px] text-[#64748b] font-medium opacity-80">Admin Control Panel</p>
        </div>

        {/* Login Card */}
        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white rounded-2xl overflow-hidden border border-white/20">
          <CardContent className="p-10 pb-8">
            <div className="mb-10 text-left">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Sign In</h2>
              <p className="text-[15px] text-[#64748b]">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-7">
              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2.5">
                <Label htmlFor="username" className="text-[14px] font-semibold text-[#334155] ml-0.5">
                  Username / Email
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="h-13 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-5 text-[15px] transition-all focus-visible:ring-2 focus-visible:ring-[#0d9488]/20 focus-visible:border-[#0d9488]"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-[14px] font-semibold text-[#334155] ml-0.5">
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-13 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-5 pr-14 text-[15px] transition-all focus-visible:ring-2 focus-visible:ring-[#0d9488]/20 focus-visible:border-[#0d9488]"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0d9488] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-[16px] rounded-xl shadow-md shadow-teal-500/10 transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Info note */}
            <div className="mt-8 p-4 bg-[#f8fafc] rounded-xl border border-[#f1f5f9] text-center">
              <p className="text-[12px] text-[#94a3b8]">
                Sign in with your administrative credentials.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
