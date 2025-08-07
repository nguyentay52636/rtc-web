"use client";

import { OngoingCall, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface isSocketContext {
    socket: Socket | null;
    isSocketConnected: boolean;
    onlineUsers: SocketUser[] | null;
    isLoading: boolean;
}

export const SocketContext = createContext<isSocketContext | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded } = useUser();
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<SocketUser[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [ongoingCall, setOngoingCall] = useState<OngoingCall | null>(null);
    const handleCall = useCallback((targetUserId: string) => {
        if (!socket || !user) return;
        socket.emit('callUser', { callerId: user.id, receiverId: targetUserId })
    }, [socket, user])
    const handleAnswerCall = useCallback(({ isAccepted }: { isAccepted: boolean }) => {
        if (!socket || !user) return;
        socket.emit('answerCall', { callerId: user.id, isAccepted })
    }, [socket, user])

    useEffect(() => {
        if (!isLoaded) {
            console.log("Clerk not loaded yet");
            return;
        }

        if (!user) {
            console.log("No user found, skipping socket connection");
            setIsLoading(false);
            return;
        }

        console.log("Creating socket connection for user:", user.id);
        setIsLoading(true);
        const socketInstance = io();
        setSocket(socketInstance);

        return () => {
            console.log("Cleaning up socket connection");
            socketInstance.close();
        }
    }, [user, isLoaded]);

    useEffect(() => {
        if (socket === null) {
            console.log("Socket is null, skipping event listeners");
            return;
        }

        console.log("Setting up socket event listeners");

        function onConnect() {
            console.log("Socket connected");
            setIsSocketConnected(true);
            setIsLoading(false);
        }

        function onDisconnect() {
            console.log("Socket disconnected");
            setIsSocketConnected(false);
        }

        if (socket.connected) {
            console.log("Socket already connected");
            onConnect();
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            console.log("Cleaning up socket event listeners");
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        }
    }, [socket]);

    // set online user
    useEffect(() => {
        if (!socket || !isSocketConnected || !user) {
            console.log("Cannot add user - socket:", !!socket, "connected:", isSocketConnected, "user:", !!user);
            return;
        }

        console.log("Adding new user to socket:", user.id);
        socket.emit('addNewUser', user);

        const handleGetUsers = (res: SocketUser[]) => {
            console.log("Received online users:", res);
            setOnlineUsers(res);
        };

        socket.on('getUsers', handleGetUsers);

        return () => {
            socket.off('getUsers', handleGetUsers);
            setOnlineUsers(null);
        }
    }, [socket, isSocketConnected, user]);

    return (
        <SocketContext.Provider value={{ socket, isSocketConnected, onlineUsers, isLoading }}>
            {children}
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