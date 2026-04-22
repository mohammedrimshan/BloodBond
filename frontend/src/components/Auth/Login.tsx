import { useState } from "react";
import { Eye, EyeOff, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/hooks/forms/useLoginForm";
import AuthSidePanel from "./AuthSidePanel";

const Login = () => {
  const { values, errors, handleChange, handleBlur, handleLogin } = useLoginForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Illustration */}
      <AuthSidePanel 
        title="Every Drop Counts." 
        subtitle="Join thousands of donors making a difference every day" 
      />

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <Droplets className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">BloodBond</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome Back, Hero
            </h1>
            <p className="text-muted-foreground">
              Sign in to manage your donations and save lives
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@abc.com"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`h-12 bg-background border-border focus:border-primary focus:ring-primary ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={values.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`h-12 bg-background border-border focus:border-primary focus:ring-primary pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Remember Me
                </Label>
              </div>
              <a 
                href="#" 
                className="text-sm text-primary hover:text-burgundy-light transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-burgundy-light text-primary-foreground font-medium transition-colors"
            >
              Login
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-muted-foreground">
            Not Registered Yet?{" "}
            <Link 
              to="/signup" 
              className="text-primary hover:text-burgundy-light font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
