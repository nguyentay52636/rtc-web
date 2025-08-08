import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Mic, Shield, AlertCircle } from 'lucide-react';

interface CameraPermissionModalProps {
    isVisible: boolean;
    onGrantPermission: () => Promise<void>;
    onDenyPermission: () => void;
    isLoading?: boolean;
}

export default function CameraPermissionModal({
    isVisible,
    onGrantPermission,
    onDenyPermission,
    isLoading = false
}: CameraPermissionModalProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Quyền truy cập Camera & Microphone
                    </h3>
                    <p className="text-gray-600 text-sm">
                        Ứng dụng cần quyền truy cập camera và microphone để thực hiện cuộc gọi video
                    </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Camera className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Camera</p>
                            <p className="text-xs text-gray-600">Hiển thị video của bạn</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <Mic className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Microphone</p>
                            <p className="text-xs text-gray-600">Thu âm giọng nói của bạn</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Bảo mật</p>
                            <p className="text-xs text-gray-600">Dữ liệu được mã hóa end-to-end</p>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg mb-6">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-yellow-800">Lưu ý</p>
                        <p className="text-xs text-yellow-700">
                            Bạn có thể tắt camera/microphone sau khi cuộc gọi bắt đầu
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <Button
                        onClick={onDenyPermission}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        disabled={isLoading}
                    >
                        Từ chối
                    </Button>
                    <Button
                        onClick={onGrantPermission}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Đang xử lý...
                            </div>
                        ) : (
                            'Cho phép'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
} 