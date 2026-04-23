import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isLoggedIn } = useSelector((state: any) => state.user);

  useEffect(() => {
    console.log("[SocketContext] Auth State:", { isLoggedIn, user });
    const userId = user?.id || user?._id;

    if (isLoggedIn && userId) {
      console.log("[Socket] Connecting with user ID:", userId);
      const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("[Socket] Connected successfully with ID:", newSocket.id);
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
  }, [isLoggedIn, user?.id, user?._id]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
