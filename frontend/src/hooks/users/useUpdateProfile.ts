import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/Service/userService";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/userSlice";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Assuming data.data contains the updated user object
      if (data?.data) {
        dispatch(updateUser(data.data));
        // Invalidate donors so home page updates if name/blood group changed
        queryClient.invalidateQueries({ queryKey: ["donors"] });
        toast.success("Profile updated successfully");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });
};
