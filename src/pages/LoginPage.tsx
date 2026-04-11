import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse, Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <HeartPulse className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-secondary-foreground">Tips & Steps</h1>
          <p className="text-xs text-secondary-foreground/60 mt-1 uppercase tracking-wider font-medium">Admin Panel</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-bold">Welcome Back</h2>
              <p className="text-xs text-muted-foreground mt-1">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Email</Label>
                <Input
                  type="email"
                  placeholder="admin@tipsandsteps.com"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-secondary-foreground/40 mt-6">
          © 2025 Tips & Steps. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
