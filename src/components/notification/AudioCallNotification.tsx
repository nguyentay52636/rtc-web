import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Phone, PhoneOff, PhoneCall, Volume2 } from 'lucide-react'

interface AudioCallNotificationProps {
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
    callDuration?: number
    isIncoming?: boolean
}

export default function AudioCallNotification({
    callerInfo,
    onAccept,
onReject,
    isVisible = true,
    callDuration = 0,
    isIncoming = true
}: AudioCallNotificationProps) {
    const [isRinging, setIsRinging] = useState(false)

    useEffect(() => {
        if (isVisible && isIncoming) {
            setIsRinging(true)
            // Add vibration if supported
            if ('vibrate' in navigator) {
                const vibrateInterval = setInterval(() => {
                    navigator.vibrate([200, 100, 200])
                }, 1000)
                return () => clearInterval(vibrateInterval)
            }
        } else {
            setIsRinging(false)
        }
    }, [isVisible, isIncoming])

    if (!isVisible || !callerInfo) return null

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                {/* Header with caller info */}
                <div className="text-center mb-8">
                    <div className="relative mb-4">
                        <Avatar className={`w-20 h-20 mx-auto ring-4 ring-blue-500/20 ${isIncoming && isRinging ? 'animate-pulse' : ''
                            }`}>
                            <AvatarImage src={callerInfo.profile.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold">
                                {callerInfo.profile.fullName?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        {isIncoming && (
                            <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 animate-ping">
                                <Phone className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {callerInfo.profile.fullName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {isIncoming ? 'Đang gọi đến...' : 'Cuộc gọi đang diễn ra'}
                    </p>
                </div>

                {/* Call duration */}
                {!isIncoming && (
                    <div className="text-center mb-8">
                        <div className="text-2xl font-mono text-gray-700">
                            {formatDuration(callDuration)}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <Volume2 className="w-4 h-4 text-green-500" />
                            <span className="text-green-500 text-sm">Đang nói chuyện</span>
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                    {isIncoming ? (
                        <>
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
                        </>
                    ) : (
                        /* End call button for ongoing calls */
                        <Button
                            onClick={onReject}
                            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <PhoneOff className="w-6 h-6 text-white" />
                        </Button>
                    )}
                </div>

                {/* Additional info */}
                {isIncoming && (
                    <div className="text-center mt-6">
                        <p className="text-xs text-gray-500">
                            Vuốt lên để trả lời • Vuốt xuống để từ chối
                        </p>
                    </div>
                )}

                {/* Ringing animation */}
                {isIncoming && isRinging && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-2xl animate-ping"></div>
                        <div className="absolute inset-0 bg-blue-500/5 rounded-2xl animate-pulse"></div>
                    </div>
                )}
            </div>
        </div>
    )
} 