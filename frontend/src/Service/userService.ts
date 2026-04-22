import { publicAxiosInstance } from "@/api/publicAxios.Instance";
import { privateAxiosInstance } from "@/api/privateAxios.Instance";
import type { IDonorsApiResponse } from "../types/DonorTypes";

export const getDonors = async (): Promise<IDonorsApiResponse> => {
  const response = await publicAxiosInstance.get<IDonorsApiResponse>("/users/donors");
  return response.data;
};

export const getProfile = async (): Promise<any> => {
  const response = await privateAxiosInstance.get("/users/profile");
  return response.data;
};

export const updateProfile = async (data: any): Promise<any> => {
  const response = await privateAxiosInstance.put("/users/profile", data);
  return response.data;
};

export const getNearbyDonors = async (lat: number, lng: number, radius: number = 10): Promise<IDonorsApiResponse> => {
  const response = await publicAxiosInstance.get<IDonorsApiResponse>(`/users/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  return response.data;
};
