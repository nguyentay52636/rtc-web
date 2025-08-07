"use client"
import { SocketContextProvider } from "@/context/SocketContext"
import { useUser } from "@clerk/nextjs"

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded } = useUser();

    // Chỉ render SocketContextProvider khi user đã được load
    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <SocketContextProvider>
            {children}
        </SocketContextProvider>
    )
}
export default SocketProvider;