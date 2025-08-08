"use client"
import { SocketContextProvider } from "@/context/SocketContext"
import { VideoCallProvider } from "@/context/VideoCallContext"
import { AudioCallProvider } from "@/context/AudioCallContext"
import { useUser } from "@clerk/nextjs"

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoaded } = useUser();

    // Chỉ render SocketContextProvider khi user đã được load
    // if (!isLoaded) {
    //     return <div>Loading...</div>;
    // }

    return (
        <SocketContextProvider>
            <VideoCallProvider>
                <AudioCallProvider>
                    {children}
                </AudioCallProvider>
            </VideoCallProvider>
        </SocketContextProvider>
    )
}
export default SocketProvider;