import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
interface isSocketContext {
    socket: Socket | null;
}
export const SocketContext = createContext<isSocketContext | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        if (!user) return;
        const socketInstance = io();
        setSocket(socketInstance);
        return () => {
            socketInstance.close();
        }
    }, [user]);
    useEffect(() => {
        if (socket === null) {
            return;
        }
        if (socket.connected) {
            onConnect();
            setIsSocketConnected(true);
        }
        function onConnect() {
            setIsSocketConnected(true);
        }
        function onDisconnect() {
            setIsSocketConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        }
    }, [socket])
    return (
        <SocketContext.Provider value={{ socket }}>

        </SocketContext.Provider>
    )

};
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context;
} 