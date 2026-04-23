import { privateAxiosInstance } from "@/api/privateAxios.Instance";

export interface INotification {
  _id: string;
  title: string;
  message: string;
  type: "eligibility" | "donation_completed" | "emergency_completed" | "emergency_verification" | "general";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export const getNotifications = async (): Promise<INotification[]> => {
  const response = await privateAxiosInstance.get("/notifications");
  return response.data.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await privateAxiosInstance.get("/notifications/unread-count");
  return response.data.data.count;
};

export const markAsRead = async (id: string): Promise<void> => {
  await privateAxiosInstance.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await privateAxiosInstance.patch("/notifications/read-all");
};
