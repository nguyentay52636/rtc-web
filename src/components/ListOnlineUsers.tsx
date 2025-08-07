import { useSocket } from '@/context/SocketContext'
import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Phone } from 'lucide-react'
import CallNotification from './notification/CallNotification'

export default function ListOnlineUsers() {
    const { onlineUsers } = useSocket()
    const { user } = useUser()
    const [incomingCall, setIncomingCall] = useState<any>(null)

    const handleCallUser = (targetUserId: string) => {
        // TODO: Replace with real call logic
        alert(`Gọi tới userId: ${targetUserId}`)
    }

    const handleAcceptCall = () => {
        console.log('Chấp nhận cuộc gọi từ:', incomingCall?.callerInfo?.profile?.fullName)
        setIncomingCall(null)
        // Thêm logic xử lý cuộc gọi ở đây
    }

    const handleRejectCall = () => {
        console.log('Từ chối cuộc gọi từ:', incomingCall?.callerInfo?.profile?.fullName)
        setIncomingCall(null)
        // Thêm logic từ chối cuộc gọi ở đây
    }

    // Simulate incoming call for demo
    const simulateIncomingCall = () => {
        const mockCaller = onlineUsers?.[0]
        if (mockCaller) {
            setIncomingCall({
                callerInfo: {
                    userId: mockCaller.userId,
                    profile: mockCaller.profile
                }
            })
        }
    }

    return (
        <>
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

                {/* Demo button for incoming call */}
                {onlineUsers && onlineUsers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={simulateIncomingCall}
                            className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                        >
                            🎭 Demo: Giả lập cuộc gọi đến
                        </button>
                    </div>
                )}
            </div>

            {/* Call Notification */}
            <CallNotification
                callerInfo={incomingCall?.callerInfo}
                onAccept={handleAcceptCall}
                onReject={handleRejectCall}
                isVisible={!!incomingCall}
            />
        </>
    )
}
