import { useQuery } from "@tanstack/react-query";
import { getDonors } from "@/Service/userService";
import type { IDonorsApiResponse } from "@/types/DonorTypes";

export const useGetDonors = () => {
  return useQuery<IDonorsApiResponse, Error>({
    queryKey: ["donors"],
    queryFn: getDonors,
    // Provide sensible defaults to avoid aggressive fetching while developing
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });
};
