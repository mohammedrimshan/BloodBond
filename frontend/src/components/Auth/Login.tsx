import { useState } from "react";
import { Eye, EyeOff, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import bloodDonationIllustration from "@/assets/bloodDonationIllustration.png";
import { useLoginForm } from "@/hooks/forms/useLoginForm";

const Login = () => {
  const { values, errors, handleChange, handleBlur, handleLogin } = useLoginForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-peach relative overflow-hidden items-center justify-center">
        {/* Decorative corner circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-burgundy/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-12 left-12 w-8 h-8 bg-burgundy/30 rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-burgundy/10 rounded-full translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-burgundy/15 rounded-full translate-x-1/3 translate-y-1/3" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-3 h-3 bg-burgundy/40 rounded-full animate-pulse" />
        <div className="absolute top-40 left-20 w-2 h-2 bg-burgundy/30 rounded-full" />
        <div className="absolute bottom-40 right-32 w-2 h-2 bg-burgundy/25 rounded-full" />
        
        {/* Diagonal lines decoration */}
        <div className="absolute top-1/4 right-1/4 w-16 h-0.5 bg-burgundy/20 rotate-45" />
        <div className="absolute bottom-1/3 left-1/3 w-12 h-0.5 bg-burgundy/15 -rotate-45" />
        
        <div className="relative z-10 flex flex-col items-center px-12">
          <img 
            src={bloodDonationIllustration} 
            alt="Blood donation community illustration" 
            className="max-w-md w-full h-auto drop-shadow-2xl"
          />
          <div className="text-center mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Every Drop Counts.
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Join thousands of donors making a difference every day
            </p>
          </div>
        </div>
      </div>

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

          {/* Google Sign In */}
          <Button 
            variant="outline" 
            className="w-full h-12 text-foreground border-border hover:bg-muted/50"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">
                or Sign in with Email
              </span>
            </div>
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
