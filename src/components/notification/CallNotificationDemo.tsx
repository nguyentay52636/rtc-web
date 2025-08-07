import React, { useState } from 'react'
import CallNotification from './CallNotification'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'

export default function CallNotificationDemo() {
    const [showCall, setShowCall] = useState(false)

    const mockCallerInfo = {
        userId: 'user123',
        profile: {
            fullName: 'Nguyễn Văn A',
            imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
    }

    const handleAcceptCall = () => {
        console.log('Cuộc gọi được chấp nhận')
        setShowCall(false)
        // Thêm logic xử lý cuộc gọi ở đây
    }

    const handleRejectCall = () => {
        console.log('Cuộc gọi bị từ chối')
        setShowCall(false)
        // Thêm logic từ chối cuộc gọi ở đây
    }

    return (
        <div className="p-8">
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Demo Call Notification</h2>
                <p className="text-gray-600 mb-6">
                    Nhấn nút bên dưới để hiển thị giao diện cuộc gọi đến
                </p>

                <Button
                    onClick={() => setShowCall(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    <Phone className="w-4 h-4 mr-2" />
                    Hiển thị cuộc gọi đến
                </Button>
            </div>

            <CallNotification
                callerInfo={mockCallerInfo}
                onAccept={handleAcceptCall}
                onReject={handleRejectCall}
                isVisible={showCall}
            />
        </div>
    )
} 