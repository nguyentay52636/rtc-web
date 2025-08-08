import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Phone, Clock, CheckCircle } from 'lucide-react'

interface CallEndedNotificationProps {
    callerInfo?: {
        userId: string
        profile: {
            fullName: string
            imageUrl?: string
        }
    }
    callDuration: number
    isVisible: boolean
    onClose: () => void
}

export default function CallEndedNotification({
    callerInfo,
    callDuration,
    isVisible,
    onClose
}: CallEndedNotificationProps) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setShow(true)
            // Auto hide after 3 seconds
            const timer = setTimeout(() => {
                setShow(false)
                setTimeout(onClose, 300) // Wait for animation to complete
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    if (!isVisible || !callerInfo) return null

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
            <div className="bg-white rounded-xl p-4 shadow-2xl border border-gray-200 max-w-sm">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={callerInfo.profile.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm">
                                {callerInfo.profile.fullName?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                            Cuộc gọi đã kết thúc
                        </h4>
                        <p className="text-xs text-gray-600">
                            {callerInfo.profile.fullName}
                        </p>
                    </div>
                </div>

                {/* Call duration */}
                <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                        Thời gian: {formatDuration(callDuration)}
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                    >
                        Đóng
                    </Button>
                    <Button
                        onClick={() => {
                            // TODO: Implement call back functionality
                            console.log('Call back:', callerInfo.userId)
                        }}
                        size="sm"
                        className="flex-1 text-xs bg-blue-500 hover:bg-blue-600"
                    >
                        <Phone className="w-3 h-3 mr-1" />
                        Gọi lại
                    </Button>
                </div>
            </div>
        </div>
    )
} 