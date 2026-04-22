import { useQuery } from "@tanstack/react-query";
import { getDonors, getNearbyDonors } from "@/Service/userService";
import type { IDonorsApiResponse } from "@/types/DonorTypes";

export const useGetDonors = () => {
  return useQuery<IDonorsApiResponse, Error>({
    queryKey: ["donors"],
    queryFn: getDonors,
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });
};

export const useGetNearbyDonors = (lat: number | null, lng: number | null, radius: number = 10) => {
  return useQuery<IDonorsApiResponse, Error>({
    queryKey: ["donors-nearby", lat, lng, radius],
    queryFn: () => getNearbyDonors(lat!, lng!, radius),
    enabled: lat !== null && lng !== null,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
