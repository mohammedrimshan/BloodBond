import { useQuery } from "@tanstack/react-query";
import adminAxios from "@/admin/api/adminAxios";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  bloodGroup?: string;
  district?: string;
  isBlocked: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  phoneNumber?: string;
  place?: string;
  photoUrl?: string;
  dateOfBirth?: string;
  whatsappNumber?: string;
  isEligible?: boolean;
  address?: string;
  pincode?: string;
  lastDonatedDate?: string;
}

export interface PaginatedUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  bloodGroup?: string;
  district?: string;
}

export const useAdminUsers = (filters: UserFilters) => {
  return useQuery<PaginatedUsersResponse>({
    queryKey: ["admin-users", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set("page", String(filters.page));
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.search) params.set("search", filters.search);
      if (filters.bloodGroup) params.set("bloodGroup", filters.bloodGroup);
      if (filters.district) params.set("district", filters.district);
      
      const { data } = await adminAxios.get(`/users?${params.toString()}`);
      return data;
    },
  });
};
