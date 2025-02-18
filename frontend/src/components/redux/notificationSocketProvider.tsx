import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import cookies from "js-cookie";
import { NOTIFICATION_SOCKET_URI } from "@/utils/constants";

interface SocketContextType {
  socket: Socket | null;
}

const NotificationSocketContext = createContext<SocketContextType>({
  socket: null,
});

export const useNotificationSocket = () =>
  useContext(NotificationSocketContext).socket;

const NotificationSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = cookies.get("token");

    if (token) {
      const socketInstance = io(NOTIFICATION_SOCKET_URI, {
        path: '/socket.io/notifications',
        withCredentials: true,
        auth: { token },
      });

      socketInstance.on("connect", () => {
        console.log("Connected to socket");
        setSocket(socketInstance);
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket");
        setSocket(null);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  return (
    <NotificationSocketContext.Provider value={{ socket }}>
      {children}
    </NotificationSocketContext.Provider>
  );
};

export default NotificationSocketProvider;
