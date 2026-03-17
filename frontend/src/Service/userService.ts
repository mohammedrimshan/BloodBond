import { publicAxiosInstance } from "@/api/publicAxios.Instance";
import type { IDonorsApiResponse } from "../types/DonorTypes";

export const getDonors = async (): Promise<IDonorsApiResponse> => {
  const response = await publicAxiosInstance.get<IDonorsApiResponse>("/users/donors");
  return response.data;
};
