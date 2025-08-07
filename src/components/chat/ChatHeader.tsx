import React from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, Settings } from 'lucide-react'

interface ChatHeaderProps {
    participantCount?: number
}

export default function ChatHeader({ participantCount = 3 }: ChatHeaderProps) {
    return (
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-gray-900 font-semibold">Meeting Chat</h3>
                        <p className="text-gray-600 text-sm">{participantCount} participants</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Settings className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
} 