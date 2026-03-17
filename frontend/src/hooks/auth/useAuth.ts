import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  verifyOTP,
  resendOTP,
  logoutUser,
} from "@/Service/authService";
import type { IAuthResponse } from "@/types/ResponseType";
import type { ILoginRequest, IRegisterRequest, IResendOtpRequest, IVerifyOtpRequest } from "@/types/UserTypes";


// Hook for registering a new user
export const useRegister = () => {
  return useMutation<IAuthResponse, Error, IRegisterRequest>({
    mutationFn: registerUser,
    mutationKey: ["register"],
  });
};

// Hook for logging in a user
export const useLogin = () => {
  return useMutation<IAuthResponse, Error, ILoginRequest>({
    mutationFn: loginUser,
    mutationKey: ["login"],
  });
};

// Hook for verifying OTP
export const useVerifyOTP = () => {
  return useMutation<IAuthResponse, Error, IVerifyOtpRequest>({
    mutationFn: verifyOTP,
    mutationKey: ["verify-otp"],
  });
};

// Hook for resending OTP
export const useResendOTP = () => {
  return useMutation<IAuthResponse, Error, IResendOtpRequest>({
    mutationFn: resendOTP,
    mutationKey: ["resend-otp"],
  });
};

// Hook for logging out a user
export const useLogout = () => {
  return useMutation<IAuthResponse, Error>({
    mutationFn: logoutUser,
    mutationKey: ["logout"],
  });
};