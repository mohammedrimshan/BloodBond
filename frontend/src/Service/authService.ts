import { authAxiosInstance } from "@/api/authAxios.Instance";
import type { IAuthResponse } from "@/types/ResponseType";
import type { ILoginRequest, IRegisterRequest, IResendOtpRequest, IVerifyOtpRequest } from "@/types/UserTypes";

// Register user
export const registerUser = async (data: IRegisterRequest): Promise<IAuthResponse> => {
  const response = await authAxiosInstance.post<IAuthResponse>("/register", data);
  return response.data;
};

// Login user
export const loginUser = async (data: ILoginRequest): Promise<IAuthResponse> => {
  const response = await authAxiosInstance.post<IAuthResponse>("/login", data);
  return response.data;
};

// Verify OTP
export const verifyOTP = async (data: IVerifyOtpRequest): Promise<IAuthResponse> => {
  const response = await authAxiosInstance.post<IAuthResponse>("/verify-otp", data);
  return response.data;
};

// Resend OTP
export const resendOTP = async (data: IResendOtpRequest): Promise<IAuthResponse> => {
  const response = await authAxiosInstance.post<IAuthResponse>("/resend-otp", data);
  return response.data;
};

// Logout user
export const logoutUser = async (): Promise<IAuthResponse> => {
  const response = await authAxiosInstance.post<IAuthResponse>("/logout");
  return response.data;
};