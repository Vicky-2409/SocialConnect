import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import cookies from "js-cookie";
import { USER_SOCKET_URI } from "@/utils/constants";

interface SocketContextType {
  socket: Socket | null;
}

const UserSocketContext = createContext<SocketContextType>({ socket: null });

export const useUserSocket = () => useContext(UserSocketContext).socket;

const UserSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = cookies.get("token");

    if (token) {
      const socketInstance = io(USER_SOCKET_URI, {
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
    <UserSocketContext.Provider value={{ socket }}>
      {children}
    </UserSocketContext.Provider>
  );
};

export default UserSocketProvider;
