export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  dateOfBirth?: string;
  bloodGroup?: string;
  place?: string;
  lastDonatedDate?: string;
  whatsappNumber?: string;
  isEligible?: boolean;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  user?: IUserResponse;
  userId?: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}