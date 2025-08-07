import { useSocket } from '@/context/SocketContext'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Phone } from 'lucide-react'

export default function ListOnlineUsers() {
    const { onlineUsers } = useSocket()
    const { user } = useUser()

    const handleCallUser = (targetUserId: string) => {
        // TODO: Replace with real call logic
        alert(`Gọi tới userId: ${targetUserId}`)
    }

    return (
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm font-medium">Online Users</span>
            </div>
            <div className="space-y-3 cursor-pointer">
                {onlineUsers && onlineUsers.map((u) => (
                    <div key={u.userId} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={u.profile.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                                {u.profile.fullName?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-gray-900 text-sm font-medium">{u.profile.fullName}</p>
                        </div>
                        {user?.id !== u.userId && (
                            <button
                                className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                                onClick={() => handleCallUser(u.userId)}
                                title="Gọi người này"
                            >
                                <Phone className="w-5 h-5 text-blue-600" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
