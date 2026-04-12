import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f9f9] p-4 font-sans">
      <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center justify-center w-16 h-16 bg-[#0d9488] rounded-2xl mb-5 shadow-lg shadow-teal-500/10">
            <HeartPulse className="w-9 h-9 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight mb-1">Tips & Steps</h1>
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
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[14px] font-semibold text-[#334155] ml-0.5">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="admin@tipsandsteps.com"
                  placeholder="admin@tipsandsteps.com"
                  className="h-13 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-5 text-[15px] transition-all focus-visible:ring-2 focus-visible:ring-[#0d9488]/20 focus-visible:border-[#0d9488]"
                  required
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
                    defaultValue="........"
                    placeholder="••••••••"
                    className="h-13 bg-[#f8fafc] border border-[#f1f5f9] rounded-xl px-5 pr-14 text-[15px] transition-all focus-visible:ring-2 focus-visible:ring-[#0d9488]/20 focus-visible:border-[#0d9488]"
                    required
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

            {/* Demo Accounts Section */}
            <div className="mt-10 p-6 bg-[#f8fafc] rounded-2xl border border-[#f1f5f9] transition-all hover:bg-[#f1f5f9]/50">
              <h3 className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-[0.05em] mb-4">Demo Accounts:</h3>
              <div className="space-y-3">
                <div className="text-[13px] text-[#64748b] flex flex-wrap items-center gap-x-2">
                  <span className="font-semibold text-[#0d9488]">admin@tipsandsteps.com</span>
                  <span className="text-[#cbd5e1]">/</span>
                  <span className="font-medium text-[#475569]">admin123</span>
                </div>
                <div className="text-[13px] text-[#64748b] flex flex-wrap items-center gap-x-2">
                  <span className="font-semibold text-[#0d9488]">manager@tipsandsteps.com</span>
                  <span className="text-[#cbd5e1]">/</span>
                  <span className="font-medium text-[#475569]">manager123</span>
                </div>
                <div className="text-[13px] text-[#64748b] flex flex-wrap items-center gap-x-2">
                  <span className="font-semibold text-[#0d9488]">doctor@tipsandsteps.com</span>
                  <span className="text-[#cbd5e1]">/</span>
                  <span className="font-medium text-[#475569]">doctor123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;


