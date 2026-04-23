import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminAxios from "@/admin/api/adminAxios";
import { privateAxiosInstance } from "@/api/privateAxios.Instance";
import { publicAxiosInstance } from "@/api/publicAxios.Instance";
import type { IDonation, PaginatedDonations } from "@/types/DonationTypes";
import { toast } from "sonner";

export const useDonations = () => {
  const queryClient = useQueryClient();

  // Admin: Mark user as donated
  const useMarkAsDonated = () => {
    return useMutation({
      mutationFn: async (userId: string) => {
        const response = await adminAxios.post(`/users/${userId}/donate`);
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message || "User marked as donated successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "donations"] });
        queryClient.invalidateQueries({ queryKey: ["donations", "recent"] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to mark as donated");
      },
    });
  };

  // Admin: Get all donations
  const useAllDonations = (page: number, limit: number) => {
    return useQuery<PaginatedDonations>({
      queryKey: ["admin", "donations", page, limit],
      queryFn: async () => {
        const response = await adminAxios.get("/donations", {
          params: { page, limit },
        });
        return response.data;
      },
    });
  };

  // User: Get my donation history
  const useMyDonations = () => {
    return useQuery<{ success: boolean; donations: IDonation[] }>({
      queryKey: ["donations", "me"],
      queryFn: async () => {
        const response = await privateAxiosInstance.get("/donations/me");
        return response.data;
      },
    });
  };

  // Public: Get recent donations for landing page
  const useRecentDonations = () => {
    return useQuery<{ success: boolean; donations: any[] }>({
      queryKey: ["donations", "recent"],
      queryFn: async () => {
        const response = await publicAxiosInstance.get("/donations/recent");
        return response.data;
      },
    });
  };

  // Admin: Get a specific user's donations with date filter
  const useAdminUserDonations = (userId: string, startDate?: string, endDate?: string) => {
    return useQuery<{ success: boolean; donations: IDonation[] }>({
      queryKey: ["admin", "donations", "user", userId, startDate, endDate],
      queryFn: async () => {
        const response = await adminAxios.get(`/users/${userId}/donations`, {
          params: { startDate, endDate },
        });
        return response.data;
      },
      enabled: !!userId,
    });
  };

  return {
    useMarkAsDonated,
    useAllDonations,
    useMyDonations,
    useRecentDonations,
    useAdminUserDonations,
  };
};
