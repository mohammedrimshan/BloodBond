import { useMutation, useQueryClient } from "@tanstack/react-query";
import adminAxios from "../api/adminAxios";
import { toast } from "sonner";

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await adminAxios.patch(`/users/${userId}/block`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to block/unblock user");
    },
  });
};
