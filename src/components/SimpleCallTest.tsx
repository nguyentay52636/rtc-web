import React, { useState } from 'react'
import { useSocket } from '@/context/SocketContext'
import { useAudioCall } from '@/context/AudioCallContext'
import { Button } from '@/components/ui/button'
import { Phone, Bell, Volume2 } from 'lucide-react'

export default function SimpleCallTest() {
    const { onlineUsers } = useSocket()
    const {
        startAudioCall,
        acceptCall,
        rejectCall,
        callStatus,
        incomingCall,
        showIncomingCall
    } = useAudioCall()
    const [selectedUser, setSelectedUser] = useState<string>('')

    const handleStartCall = async (userId: string) => {
        try {
            console.log('🚀 Bắt đầu gọi cho user:', userId)
            await startAudioCall(userId)
            console.log('✅ Đã gửi yêu cầu cuộc gọi')
        } catch (error) {
            console.error('❌ Lỗi khi bắt đầu cuộc gọi:', error)
            alert('Không thể bắt đầu cuộc gọi')
        }
    }

    const handleAcceptCall = async () => {
        try {
            console.log('✅ Chấp nhận cuộc gọi')
            await acceptCall()
        } catch (error) {
            console.error('❌ Lỗi khi chấp nhận cuộc gọi:', error)
        }
    }

    const handleRejectCall = () => {
        console.log('❌ Từ chối cuộc gọi')
        rejectCall()
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-blue-500" />
                Test Cuộc gọi đến với Thông báo
            </h2>

            <div className="space-y-6">
                {/* Status */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Trạng thái</h3>
                    <div className="space-y-1 text-sm">
                        <p><strong>Call Status:</strong> <span className="text-blue-600">{callStatus}</span></p>
                        <p><strong>Incoming Call:</strong> <span className={incomingCall ? 'text-green-600' : 'text-red-600'}>{incomingCall ? 'Có' : 'Không'}</span></p>
                        <p><strong>Show Notification:</strong> <span className={showIncomingCall ? 'text-green-600' : 'text-red-600'}>{showIncomingCall ? 'Hiển thị' : 'Ẩn'}</span></p>
                        {incomingCall && (
                            <p><strong>Người gọi:</strong> <span className="text-blue-600">{incomingCall.callerInfo?.profile?.fullName}</span></p>
                        )}
                    </div>
                </div>

                {/* Call Controls */}
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-3 text-blue-800">Gọi cho user khác</h3>

                    {/* User Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Chọn user để gọi:</label>
                        <select
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">-- Chọn user --</option>
                            {onlineUsers?.map((user) => (
                                <option key={user.userId} value={user.userId}>
                                    {user.profile.fullName} (ID: {user.userId})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Call Button */}
                    <Button
                        onClick={() => handleStartCall(selectedUser)}
                        disabled={!selectedUser || callStatus !== 'idle'}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        Gọi cho user đã chọn
                    </Button>

                    <p className="text-xs text-gray-600 mt-2">
                        * User được chọn sẽ nhận thông báo cuộc gọi đến với chuông Despacito
                    </p>
                </div>

                {/* Incoming Call Notification */}
                {callStatus === 'ringing' && (
                    <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
                        <h3 className="font-semibold mb-3 text-yellow-800 flex items-center gap-2">
                            <Volume2 className="w-5 h-5" />
                            🎵 Có cuộc gọi đến - Despacito đang phát!
                        </h3>
                        <div className="space-y-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Người gọi:</strong> {incomingCall?.callerInfo?.profile?.fullName}
                            </p>
                            <p className="text-sm text-yellow-700">
                                Chuông "Despacito" sẽ phát cho đến khi bạn chấp nhận hoặc từ chối cuộc gọi.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleAcceptCall}
                                    className="bg-green-500 hover:bg-green-600 flex-1"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Chấp nhận
                                </Button>
                                <Button
                                    onClick={handleRejectCall}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Từ chối
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Online Users List */}
                <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold mb-3 text-green-800">Danh sách Online Users</h3>
                    <div className="space-y-2">
                        {onlineUsers?.map((user) => (
                            <div key={user.userId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <div>
                                    <p className="font-medium">{user.profile.fullName}</p>
                                    <p className="text-xs text-gray-600">ID: {user.userId}</p>
                                </div>
                                <Button
                                    onClick={() => handleStartCall(user.userId)}
                                    disabled={callStatus !== 'idle'}
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600"
                                >
                                    <Phone className="w-4 h-4 mr-1" />
                                    Gọi
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Test Instructions */}
                <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold mb-3 text-purple-800">Hướng dẫn test</h3>
                    <ol className="text-sm text-purple-700 space-y-2">
                        <li>1. <strong>Mở 2 tab trình duyệt</strong> với cùng ứng dụng</li>
                        <li>2. <strong>Đăng nhập 2 user khác nhau</strong> trên 2 tab</li>
                        <li>3. <strong>Tab 1:</strong> Chọn user từ danh sách và click "Gọi"</li>
                        <li>4. <strong>Tab 2:</strong> Sẽ nghe thấy chuông "Despacito" và thấy thông báo cuộc gọi đến</li>
                        <li>5. <strong>Tab 2:</strong> Click "Chấp nhận" hoặc "Từ chối" để kết thúc chuông</li>
                    </ol>
                </div>

                {/* Debug Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Debug Info</h3>
                    <div className="text-xs space-y-1">
                        <p><strong>Online Users:</strong> {onlineUsers?.length || 0}</p>
                        <p><strong>Selected User:</strong> {selectedUser || 'None'}</p>
                        <p><strong>Socket Connected:</strong> {onlineUsers ? 'Yes' : 'No'}</p>
                        <p><strong>Current User ID:</strong> {onlineUsers?.[0]?.userId || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
} 