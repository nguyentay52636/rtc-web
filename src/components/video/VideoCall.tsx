import React, { useRef, useEffect } from 'react';
import { useVideoCall } from '@/context/VideoCallContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Settings } from 'lucide-react';
import CameraPermissionModal from '../notification/CameraPermissionModal';

export default function VideoCall() {
    const {
        isInCall,
        callStatus,
        localStream,
        remoteStream,
        isLocalVideoEnabled,
        isLocalAudioEnabled,
        targetUser,
        callerUser,
        callDuration,
        showCameraPermission,
        isRequestingPermission,
        toggleLocalVideo,
        toggleLocalAudio,
        endCall,
        acceptCall,
        rejectCall,
        grantCameraPermission,
        denyCameraPermission,
    } = useVideoCall();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Connect local video stream to video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Connect remote video stream to video element
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Format call duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isInCall) return null;

    const currentUser = targetUser || callerUser;

    return (
        <>
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={currentUser?.profile?.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                {currentUser?.profile?.fullName?.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-white font-semibold">{currentUser?.profile?.fullName}</h3>
                            <p className="text-gray-300 text-sm">
                                {callStatus === 'connected' ? formatDuration(callDuration) : 'Đang kết nối...'}
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>

                {/* Video Area */}
                <div className="flex-1 relative">
                    {/* Remote Video (Main) */}
                    <div className="absolute inset-0">
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={currentUser?.profile?.imageUrl} />
                                            <AvatarFallback className="bg-white text-gray-800 text-2xl font-bold">
                                                {currentUser?.profile?.fullName?.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-2">{currentUser?.profile?.fullName}</h2>
                                    <p className="text-gray-300">
                                        {callStatus === 'calling' ? 'Đang gọi...' :
                                            callStatus === 'ringing' ? 'Cuộc gọi đến...' :
                                                'Đang kết nối...'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Local Video (Picture-in-Picture) */}
                    {localStream && (
                        <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {!isLocalVideoEnabled && (
                                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                    <VideoOff className="w-8 h-8 text-white" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Call Status Overlay */}
                    {callStatus === 'calling' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                                    <Phone className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Đang gọi...</h3>
                                <p className="text-gray-300">Chờ người dùng trả lời</p>
                            </div>
                        </div>
                    )}

                    {callStatus === 'ringing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center text-white">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                                    <Phone className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Cuộc gọi đến</h3>
                                <p className="text-gray-300 mb-6">Từ {callerUser?.profile?.fullName}</p>
                                <div className="flex gap-4 justify-center">
                                    <Button
                                        onClick={rejectCall}
                                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
                                    >
                                        <PhoneOff className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        onClick={acceptCall}
                                        className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"
                                    >
                                        <Phone className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                    <Button
                        onClick={toggleLocalAudio}
                        variant="outline"
                        size="lg"
                        className={`rounded-full ${isLocalAudioEnabled
                                ? 'bg-white text-gray-700 hover:bg-gray-50'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                    >
                        {isLocalAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        onClick={endCall}
                        size="lg"
                        className="rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    >
                        <PhoneOff className="w-5 h-5" />
                    </Button>

                    <Button
                        onClick={toggleLocalVideo}
                        variant="outline"
                        size="lg"
                        className={`rounded-full ${isLocalVideoEnabled
                                ? 'bg-white text-gray-700 hover:bg-gray-50'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                    >
                        {isLocalVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                </div>
            </div>

            {/* Camera Permission Modal */}
            <CameraPermissionModal
                isVisible={showCameraPermission}
                onGrantPermission={grantCameraPermission}
                onDenyPermission={denyCameraPermission}
                isLoading={isRequestingPermission}
            />
        </>
    );
} 