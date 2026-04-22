export interface IDonorResponse {
  id: string;
  name: string;
  bloodGroup: string;
  place: string;
  lastDonatedDate?: string;
  photoUrl?: string;
  isEligible?: boolean;
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
