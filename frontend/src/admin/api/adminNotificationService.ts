import adminAxios from "./adminAxios";
import type { INotification } from "@/Service/notificationService";

export const getAdminNotifications = async (): Promise<INotification[]> => {
  const response = await adminAxios.get("/notifications");
  return response.data.data;
};

export const getAdminUnreadCount = async (): Promise<number> => {
  const response = await adminAxios.get("/notifications/unread-count");
  return response.data.data.count;
};

export const markAdminAsRead = async (id: string): Promise<void> => {
  await adminAxios.patch(`/notifications/${id}/read`);
};

export const markAdminAllAsRead = async (): Promise<void> => {
  await adminAxios.patch("/notifications/read-all");
};
