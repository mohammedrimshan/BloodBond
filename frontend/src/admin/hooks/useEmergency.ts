import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import adminAxios from "@/admin/api/adminAxios";
import { toast } from "sonner";

export interface EmergencyRequestType {
  _id: string;
  patientName: string;
  hospitalName: string;
  bloodGroup: string;
  status: "Pending" | "In Progress" | "Completed";
  readyUsers: Array<{
    _id: string;
    name: string;
    email: string;
    bloodGroup: string;
    photoUrl?: string;
    district?: string;
    phoneNumber?: string;
  }>;
  completedByUser?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export const useGetEmergencies = () => {
  return useQuery<{ success: boolean; requests: EmergencyRequestType[] }>({
    queryKey: ["admin", "emergencies"],
    queryFn: async () => {
      const response = await adminAxios.get("/emergency");
      return response.data;
    },
  });
};

export const useCreateEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { patientName: string; hospitalName: string; bloodGroup: string }) => {
      const response = await adminAxios.post("/emergency", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Emergency broadcast sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "emergencies"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to broadcast emergency.");
    },
  });
};

export const useUpdateEmergency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, completedByUserId }: { id: string; status: string; completedByUserId?: string }) => {
      const response = await adminAxios.put(`/emergency/${id}/status`, { status, completedByUserId });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin", "emergencies"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status.");
    },
  });
};
