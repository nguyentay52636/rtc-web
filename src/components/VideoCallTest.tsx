import React from 'react';
import { useVideoCall } from '@/context/VideoCallContext';
import { useSocket } from '@/context/SocketContext';
import { Button } from '@/components/ui/button';
import { Video, Phone, Camera } from 'lucide-react';

export default function VideoCallTest() {
    const { onlineUsers } = useSocket();
    const {
        startVideoCall,
        callStatus,
        isInCall,
        requestCameraPermission,
        grantCameraPermission,
        denyCameraPermission,
        showCameraPermission,
        isRequestingPermission
    } = useVideoCall();

    const handleTestVideoCall = async (targetUserId: string) => {
        try {
            console.log('Starting video call to:', targetUserId);
            await startVideoCall(targetUserId);
        } catch (error) {
            console.error('Failed to start video call:', error);
        }
    };

    const handleTestCameraPermission = async () => {
        try {
            const hasPermission = await requestCameraPermission();
            console.log('Camera permission result:', hasPermission);
            alert(hasPermission ? 'Camera permission granted!' : 'Camera permission denied!');
        } catch (error) {
            console.error('Camera permission error:', error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4">Video Call Test</h2>

            <div className="space-y-4">
                {/* Camera Permission Test */}
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Camera Permission Test</h3>
                    <Button
                        onClick={handleTestCameraPermission}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        <Camera className="w-4 h-4 mr-2" />
                        Test Camera Permission
                    </Button>
                </div>

                {/* Video Call Test */}
                <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Video Call Test</h3>
                    {onlineUsers && onlineUsers.length > 0 ? (
                        <div className="space-y-2">
                            {onlineUsers.map((user) => (
                                <Button
                                    key={user.userId}
                                    onClick={() => handleTestVideoCall(user.userId)}
                                    disabled={callStatus === 'calling' || callStatus === 'ringing'}
                                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
                                >
                                    <Video className="w-4 h-4 mr-2" />
                                    Call {user.profile.fullName}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm">No online users available</p>
                    )}
                </div>

                {/* Call Status */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Call Status</h3>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">In Call:</span> {isInCall ? 'Yes' : 'No'}</p>
                        <p><span className="font-medium">Call Status:</span> {callStatus}</p>
                        <p><span className="font-medium">Show Permission Modal:</span> {showCameraPermission ? 'Yes' : 'No'}</p>
                        <p><span className="font-medium">Requesting Permission:</span> {isRequestingPermission ? 'Yes' : 'No'}</p>
                    </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Instructions</h3>
                    <ul className="text-sm space-y-1 text-gray-700">
                        <li>• Click "Test Camera Permission" to check camera access</li>
                        <li>• Click "Call [User]" to start a video call</li>
                        <li>• Allow camera/microphone when prompted</li>
                        <li>• Use the video call interface to control the call</li>
                    </ul>
                </div>
            </div>
        </div>
    );
} 