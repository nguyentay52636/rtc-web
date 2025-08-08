import React from 'react'
import { useAudioCall } from '@/context/AudioCallContext'
import { useSocket } from '@/context/SocketContext'
import { Button } from '@/components/ui/button'
import { Phone, PhoneOff, Volume2 } from 'lucide-react'
import RingtoneTest from './RingtoneTest'
import IncomingCallDemo from './IncomingCallDemo'
import SimpleCallTest from './SimpleCallTest'

export default function AudioCallDemo() {
    const { onlineUsers } = useSocket()
    const {
        startAudioCall,
        acceptCall,
        rejectCall,
        endCall,
        callStatus,
        callDuration,
        isInCall,
        isCaller,
        isReceiver,
        targetUser,
        callerUser
    } = useAudioCall()

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartCall = async (userId: string) => {
        try {
            await startAudioCall(userId)
        } catch (error) {
            console.error('Failed to start call:', error)
        }
    }

    const handleAcceptCall = async () => {
        try {
            await acceptCall()
        } catch (error) {
            console.error('Failed to accept call:', error)
        }
    }

    const handleRejectCall = () => {
        rejectCall()
    }

    const handleEndCall = () => {
        endCall()
    }

    return (
        <div className="space-y-6">
            {/* Simple Call Test */}
            <SimpleCallTest />

            {/* Incoming Call Demo */}
            <IncomingCallDemo />

            {/* Ringtone Test */}
            <RingtoneTest />

            {/* Audio Call Demo */}
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Audio Call Demo</h2>

                {/* Call Status */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Call Status</h3>
                    <div className="space-y-2 text-sm">
                        <p><strong>Status:</strong> {callStatus}</p>
                        <p><strong>In Call:</strong> {isInCall ? 'Yes' : 'No'}</p>
                        <p><strong>Role:</strong> {isCaller ? 'Caller' : isReceiver ? 'Receiver' : 'None'}</p>
                        {callDuration > 0 && (
                            <p><strong>Duration:</strong> {formatDuration(callDuration)}</p>
                        )}
                        {targetUser && (
                            <p><strong>Target:</strong> {targetUser.profile.fullName}</p>
                        )}
                        {callerUser && (
                            <p><strong>Caller:</strong> {callerUser.profile.fullName}</p>
                        )}
                    </div>
                </div>

                {/* Online Users */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Online Users</h3>
                    <div className="space-y-2">
                        {onlineUsers?.map((user) => (
                            <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm">{user.profile.fullName}</span>
                                <Button
                                    onClick={() => handleStartCall(user.userId)}
                                    disabled={callStatus !== 'idle'}
                                    size="sm"
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    <Phone className="w-4 h-4 mr-1" />
                                    Call
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call Controls */}
                {callStatus === 'ringing' && (
                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold mb-3 text-yellow-800">Incoming Call</h3>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleAcceptCall}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                <Phone className="w-4 h-4 mr-1" />
                                Accept
                            </Button>
                            <Button
                                onClick={handleRejectCall}
                                variant="destructive"
                            >
                                <PhoneOff className="w-4 h-4 mr-1" />
                                Reject
                            </Button>
                        </div>
                    </div>
                )}

                {callStatus === 'connected' && (
                    <div className="mb-6 p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold mb-3 text-green-800">Call in Progress</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Volume2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm">{formatDuration(callDuration)}</span>
                            </div>
                            <Button
                                onClick={handleEndCall}
                                variant="destructive"
                                size="sm"
                            >
                                <PhoneOff className="w-4 h-4 mr-1" />
                                End Call
                            </Button>
                        </div>
                    </div>
                )}

                {/* Test Buttons */}
                <div className="space-y-2">
                    <h3 className="font-semibold">Test Functions</h3>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            onClick={() => console.log('Current call status:', callStatus)}
                            variant="outline"
                            size="sm"
                        >
                            Log Status
                        </Button>
                        <Button
                            onClick={() => console.log('Online users:', onlineUsers)}
                            variant="outline"
                            size="sm"
                        >
                            Log Users
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 