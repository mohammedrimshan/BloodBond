import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
} from "../Service/notificationService";
import type { INotification } from "../Service/notificationService";

export const useNotifications = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  return useQuery<INotification[], Error>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: isLoggedIn,
  });
};

export const useUnreadCount = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  return useQuery<number, Error>({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled: isLoggedIn,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
