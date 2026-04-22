import { useQuery } from "@tanstack/react-query";
import adminAxios from "../api/adminAxios";

export interface AnalyticsData {
  stats: {
    total: number;
    active: number;
    blocked: number;
    verified: number;
  };
  bloodGroups: { _id: string; count: number }[];
  userGrowth: { _id: { month: number; year: number }; count: number }[];
}

export const useAdminAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const { data } = await adminAxios.get("/analytics");
      return data;
    },
  });
};
