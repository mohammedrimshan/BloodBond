
export interface IRegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  photoUrl?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  place?: string;
  lastDonatedDate?: string;
  whatsappNumber?: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IVerifyOtpRequest {
  userId: string;
  otp: string;
  email: string;
}

export interface IResendOtpRequest {
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl: string | null;
  isVerified: boolean;
  dateOfBirth?: string;
  bloodGroup?: string;
  place?: string;
  lastDonatedDate?: string;
  whatsappNumber?: string;
  isEligible?: boolean;
}
