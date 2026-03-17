// ─── Auth Toast Messages ─────────────────────────────────────
export const AUTH_TOASTS = {
  REGISTER_SUCCESS: "Registration successful! Please verify your email.",
  REGISTER_FAILED: "Registration failed. Please try again.",
  LOGIN_SUCCESS: "Welcome back! Login successful.",
  LOGIN_FAILED: "Login failed. Please try again.",
  VALIDATION_ERROR: "Please fix the errors below.",
} as const;

// ─── OTP Toast Messages ─────────────────────────────────────
export const OTP_TOASTS = {
  VERIFY_SUCCESS: "Email verified successfully",
  VERIFY_FAILED: "Invalid OTP",
  INCOMPLETE: "Enter full 6-digit OTP",
  RESEND_SUCCESS: "OTP resent successfully",
  RESEND_FAILED: "Failed to resend OTP",
} as const;

// ─── Profile Toast Messages ─────────────────────────────────
export const PROFILE_TOASTS = {
  LOGOUT_SUCCESS: "Logged out successfully",
  LOGOUT_FAILED: "Logout failed",
  ACCOUNT_CREATED: "Account created successfully!",
} as const;

// ─── Donor Toast Messages ────────────────────────────────────
export const DONOR_TOASTS = {
  ALREADY_REGISTERED: "You're already registered! Thank you for being a donor. 🩸",
} as const;
