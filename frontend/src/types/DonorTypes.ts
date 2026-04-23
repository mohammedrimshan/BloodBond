export interface IDonorResponse {
  id: string;
  name: string;
  bloodGroup: string;
  place: string;
  lastDonatedDate?: string;
  photoUrl?: string;
  isEligible?: boolean;
  totalDonations?: number;
  location?: {
    type: string;
    coordinates: number[];
  };
}

export interface IDonorsApiResponse {
  success: boolean;
  message: string;
  data: IDonorResponse[];
}

export interface IPublicUserProfile {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  bloodGroup: string;
  place?: string;
  district?: string;
  photoUrl?: string;
  lastDonatedDate?: string;
  isEligible: boolean;
  totalDonations: number;
}

export interface IPublicUserApiResponse {
  success: boolean;
  data: IPublicUserProfile;
}
