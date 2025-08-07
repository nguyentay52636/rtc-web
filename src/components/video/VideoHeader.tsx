import React from 'react'
import { Button } from '@/components/ui/button'
import { Video, Share2, Settings, Clock } from 'lucide-react'
import { VideoHeaderProps } from '@/types/video'

export default function VideoHeader({
    meetingTitle = "Team Meeting",
    startTime = "2:30 PM",
    participantCount = 3
}: VideoHeaderProps) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">{meetingTitle}</h1>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Started {startTime} • {participantCount} participants
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
                <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Settings className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
} 