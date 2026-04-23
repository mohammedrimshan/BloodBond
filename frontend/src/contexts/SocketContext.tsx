import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isLoggedIn } = useSelector((state: any) => state.user);
  const { admin, isAuthenticated: isAdminAuthenticated } = useSelector((state: any) => state.admin);
  const queryClient = useQueryClient();

  useEffect(() => {
    const isUserActive = isLoggedIn && (user?.id || user?._id);
    const isAdminActive = isAdminAuthenticated && (admin?.id || admin?._id);
    
    console.log("[SocketContext] Auth State:", { isUserActive, isAdminActive });
    const currentUserId = isUserActive ? (user?.id || user?._id) : (admin?.id || admin?._id);

    if (isUserActive || isAdminActive) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
      const socketUrl = baseUrl.replace("/api", "");
      
      console.log("[Socket] Connecting to:", socketUrl, "with user ID:", currentUserId);
      
      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("[Socket] Connected successfully with ID:", newSocket.id);
      });

      newSocket.on("new_notification", (notification) => {
        console.log("[Socket] New Notification Received:", notification);
        toast.info(notification.title, {
          description: notification.message,
          duration: 6000,
        });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
      });

      newSocket.on("emergency_blood_request", (payload) => {
        console.log("[Socket] EMERGENCY Received in Context:", payload);
        toast.error("🚨 EMERGENCY BLOOD REQUIREMENT", {
          description: payload.message,
          duration: 10000,
        });
      });

      newSocket.on("connect_error", (err) => {
        console.error("[Socket] Connection Error:", err.message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [isLoggedIn, isAdminAuthenticated, user?.id, user?._id, admin?.id, admin?._id, queryClient]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
