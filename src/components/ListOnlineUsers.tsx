import { useSocket } from '@/context/SocketContext'
import { useUser } from '@clerk/nextjs'
import React from 'react'

export default function ListOnlineUsers() {
    const { onlineUsers } = useSocket()
    const { user } = useUser()

    return (
        <div>ListOnlineUsers</div>
    )
}
