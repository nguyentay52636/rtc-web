import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Phone, PhoneOff, PhoneCall } from 'lucide-react'

interface CallNotificationProps {
    callerInfo?: {
        userId: string
        profile: {
            fullName: string
            imageUrl?: string
        }
    }
    onAccept?: () => void
    onReject?: () => void
    isVisible?: boolean
}

export default function CallNotification({
    callerInfo,
    onAccept,
    onReject,
    isVisible = true
}: CallNotificationProps) {
    if (!isVisible || !callerInfo) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                {/* Header with caller info */}
                <div className="text-center mb-8">
                    <div className="relative mb-4">
                        <Avatar className="w-20 h-20 mx-auto ring-4 ring-green-500/20 animate-pulse">
                            <AvatarImage src={callerInfo.profile.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-2xl font-bold">
                                {callerInfo.profile.fullName?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 animate-ping">
                            <Phone className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {callerInfo.profile.fullName}
                    </h3>
                    <p className="text-gray-600 text-sm">Đang gọi đến...</p>
                </div>

                {/* Call duration (optional) */}
                <div className="text-center mb-8">
                    <div className="text-2xl font-mono text-gray-700">00:00</div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                    {/* Reject button */}
                    <Button
                        onClick={onReject}
                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <PhoneOff className="w-6 h-6 text-white" />
                    </Button>

                    {/* Accept button */}
                    <Button
                        onClick={onAccept}
                        className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <PhoneCall className="w-6 h-6 text-white" />
                    </Button>
                </div>

                {/* Additional info */}
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        Vuốt lên để trả lời • Vuốt xuống để từ chối
                    </p>
                </div>
            </div>
        </div>
    )
}
