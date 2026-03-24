import { useQuery } from "@tanstack/react-query";
import adminAxios from "../api/adminAxios";

export interface UserStats {
  total: number;
  active: number;
  blocked: number;
  verified: number;
}

export const useAdminStats = () => {
  return useQuery<UserStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await adminAxios.get("/users/stats");
      return data.stats;
    },
  });
};
