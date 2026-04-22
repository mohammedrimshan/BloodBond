import { useState } from "react";
import { Eye, EyeOff, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OTPModal from "../Modal/OtpModal";
import { useSignupForm } from "@/hooks/forms/useSignupForm";
import AuthSidePanel from "./AuthSidePanel";

const Signup = () => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSignup,
    showOTPModal,
    setShowOTPModal,
    userId,
    handleOTPVerified,
    isPending,
    currentStep,
    nextStep,
    prevStep,
  } = useSignupForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Illustration */}
      <AuthSidePanel 
        title="Be Someone's Hero Today." 
        subtitle="Your donation can save up to 3 lives" 
      />

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Header */}
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <Droplets className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">BloodBond</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {currentStep === 1 ? "Become a Lifesaver" : "Donor Information"}
            </h1>
            <p className="text-muted-foreground">
              {currentStep === 1 
                ? "Step 1: Create your account" 
                : "Step 2: Tell us more about yourself"}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between py-2 mb-2">
            <div className={`flex flex-col items-center gap-2 transition-colors duration-300 ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${currentStep === 1 ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Account</span>
            </div>
            <div className={`h-1.5 flex-1 mx-4 rounded-full overflow-hidden ${currentStep === 2 ? 'bg-primary/20' : 'bg-border'}`}>
              <div className={`h-full bg-primary rounded-full transition-all duration-700 ease-in-out ${currentStep === 2 ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex flex-col items-center gap-2 transition-colors duration-300 ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${currentStep === 2 ? 'bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/10' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Profile</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4 relative min-h-[400px]">
            {currentStep === 1 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={values.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="John Doe"
                    error={errors.name}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="mail@abc.com"
                    error={errors.email}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={values.phoneNumber}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    onBlur={() => handleBlur("phoneNumber")}
                    placeholder="Enter your number"
                    error={errors.phoneNumber}
                  />
                  {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="••••••••"
                      error={errors.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={values.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="••••••••"
                      error={errors.confirmPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="button" onClick={nextStep} className="w-full h-12 mt-6 shadow-md group">
                  Continue to Profile
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={values.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    onBlur={() => handleBlur("dateOfBirth")}
                    error={errors.dateOfBirth}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <select
                    id="bloodGroup"
                    value={values.bloodGroup}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    onBlur={() => handleBlur("bloodGroup")}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && <p className="text-xs text-red-500">{errors.bloodGroup}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place">Place (City/District)</Label>
                  <Input
                    id="place"
                    value={values.place}
                    onChange={(e) => handleChange("place", e.target.value)}
                    onBlur={() => handleBlur("place")}
                    placeholder="New York, NY"
                    error={errors.place}
                  />
                  {errors.place && <p className="text-xs text-red-500">{errors.place}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number (Optional)</Label>
                  <Input
                    id="whatsappNumber"
                    value={values.whatsappNumber}
                    onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                    onBlur={() => handleBlur("whatsappNumber")}
                    placeholder="Same as mobile or different"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastDonatedDate">Last Donated Date (Optional)</Label>
                  <Input
                    id="lastDonatedDate"
                    type="date"
                    value={values.lastDonatedDate}
                    onChange={(e) => handleChange("lastDonatedDate", e.target.value)}
                    onBlur={() => handleBlur("lastDonatedDate")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank if you've never donated or don't remember.
                  </p>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 hover:bg-muted/50 border-input">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </Button>
                  <Button type="submit" className="flex-[2] h-12 shadow-md shadow-primary/20" disabled={isPending}>
                    {isPending ? "Creating Account..." : "Complete Signup"}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={values.email}
        onVerified={handleOTPVerified}
        userId={userId}
      />
    </div>
  );
};

export default Signup;
