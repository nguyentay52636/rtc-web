import { useSocket } from '@/context/SocketContext'
import { useVideoCall } from '@/context/VideoCallContext'
import { useAudioCall } from '@/context/AudioCallContext'
import { useUser } from '@clerk/nextjs'
import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Phone, Video } from 'lucide-react'
import CallNotification from './notification/CallNotification'
import AudioCallNotification from './notification/AudioCallNotification'
import CallEndedNotification from './notification/CallEndedNotification'
import VideoCall from './video/VideoCall'

export default function ListOnlineUsers() {
    const { onlineUsers } = useSocket()
    const { user } = useUser()
    const { startVideoCall, callStatus: videoCallStatus } = useVideoCall()
    const {
        startAudioCall,
        acceptCall,
        rejectCall,
        endCall,
        callStatus: audioCallStatus,
        callDuration,
        incomingCall,
        showIncomingCall,
        targetUser,
        callerUser,
        isInCall,
        isCaller,
        isReceiver
    } = useAudioCall()
    const [incomingVideoCall, setIncomingVideoCall] = useState<any>(null)
    const [callEndedInfo, setCallEndedInfo] = useState<{
        callerInfo: any;
        duration: number;
        isVisible: boolean;
    } | null>(null)

    const handleCallUser = async (targetUserId: string) => {
        try {
            await startAudioCall(targetUserId)
        } catch (error) {
            console.error('Failed to start audio call:', error)
            alert('Không thể bắt đầu cuộc gọi thoại')
        }
    }

    const handleVideoCallUser = async (targetUserId: string) => {
        try {
            await startVideoCall(targetUserId)
        } catch (error) {
            console.error('Failed to start video call:', error)
            alert('Không thể bắt đầu cuộc gọi video')
        }
    }

    const handleAcceptVideoCall = () => {
        console.log('Chấp nhận cuộc gọi video từ:', incomingVideoCall?.callerInfo?.profile?.fullName)
        setIncomingVideoCall(null)
        // Thêm logic xử lý cuộc gọi video ở đây
    }

    const handleRejectVideoCall = () => {
        console.log('Từ chối cuộc gọi video từ:', incomingVideoCall?.callerInfo?.profile?.fullName)
        setIncomingVideoCall(null)
        // Thêm logic từ chối cuộc gọi video ở đây
    }

    const handleAcceptAudioCall = async () => {
        try {
            await acceptCall()
        } catch (error) {
            console.error('Failed to accept audio call:', error)
            alert('Không thể chấp nhận cuộc gọi')
        }
    }

    const handleRejectAudioCall = () => {
        rejectCall()
    }

    const handleEndAudioCall = () => {
        const currentCaller = isCaller ? targetUser : callerUser
        const duration = callDuration

        endCall()

        // Show call ended notification
        if (currentCaller) {
            setCallEndedInfo({
                callerInfo: currentCaller,
                duration,
                isVisible: true
            })
        }
    }

    const handleCloseCallEndedNotification = () => {
        setCallEndedInfo(null)
    }

    // Simulate incoming video call for demo
    const simulateIncomingVideoCall = () => {
        const mockCaller = onlineUsers?.[0]
        if (mockCaller) {
            setIncomingVideoCall({
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
                                {(videoCallStatus === 'calling' || audioCallStatus === 'calling') &&
                                    (u.userId === (isCaller ? targetUser?.userId : callerUser?.userId)) && (
                                        <p className="text-blue-600 text-xs">Đang gọi...</p>
                                    )}
                                {audioCallStatus === 'connected' &&
                                    (u.userId === (isCaller ? targetUser?.userId : callerUser?.userId)) && (
                                        <p className="text-green-600 text-xs">Đang nói chuyện...</p>
                                    )}
                            </div>
                            {user?.id !== u.userId && (
                                <div className="flex gap-2">
                                    <button
                                        className="p-2 rounded-full hover:bg-blue-100 transition-colors"
                                        onClick={() => handleCallUser(u.userId)}
                                        title="Gọi thoại"
                                        disabled={audioCallStatus === 'calling' || audioCallStatus === 'ringing' || audioCallStatus === 'connected' ||
                                            videoCallStatus === 'calling' || videoCallStatus === 'ringing' || videoCallStatus === 'connected'}
                                    >
                                        <Phone className="w-5 h-5 text-blue-600" />
                                    </button>
                                    <button
                                        className="p-2 rounded-full hover:bg-green-100 transition-colors"
                                        onClick={() => handleVideoCallUser(u.userId)}
                                        title="Gọi video"
                                        disabled={audioCallStatus === 'calling' || audioCallStatus === 'ringing' || audioCallStatus === 'connected' ||
                                            videoCallStatus === 'calling' || videoCallStatus === 'ringing' || videoCallStatus === 'connected'}
                                    >
                                        <Video className="w-5 h-5 text-green-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Demo buttons */}
                {onlineUsers && onlineUsers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                        <button
                            onClick={simulateIncomingVideoCall}
                            className="w-full p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                        >
                            🎭 Demo: Giả lập cuộc gọi video đến
                        </button>
                    </div>
                )}
            </div>

            {/* Video Call Notification */}
            <CallNotification
                callerInfo={incomingVideoCall?.callerInfo}
                onAccept={handleAcceptVideoCall}
                onReject={handleRejectVideoCall}
                isVisible={!!incomingVideoCall}
            />

            {/* Audio Call Notification */}
            <AudioCallNotification
                callerInfo={incomingCall?.callerInfo}
                onAccept={handleAcceptAudioCall}
                onReject={handleRejectAudioCall}
                isVisible={showIncomingCall}
                callDuration={callDuration}
                isIncoming={true}
            />

            {/* Ongoing Audio Call */}
            {isInCall && (isCaller ? targetUser : callerUser) && (
                <AudioCallNotification
                    callerInfo={isCaller ? targetUser : callerUser}
                    onReject={handleEndAudioCall}
                    isVisible={true}
                    callDuration={callDuration}
                    isIncoming={false}
                />
            )}

            {/* Call Ended Notification */}
            {callEndedInfo && (
                <CallEndedNotification
                    callerInfo={callEndedInfo.callerInfo}
                    callDuration={callEndedInfo.duration}
                    isVisible={callEndedInfo.isVisible}
                    onClose={handleCloseCallEndedNotification}
                />
            )}

            {/* Video Call Component */}
            <VideoCall />
        </>
    )
}
