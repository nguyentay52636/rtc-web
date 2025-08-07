import React from 'react'
import { Button } from '@/components/ui/button'
import { Phone, Video, Mic, ScreenShare, CircleDot, MoreVertical } from 'lucide-react'

export default function VideoControls() {
    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-xl border border-gray-200">
            <Button size="lg" variant="outline" className="rounded-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                <Mic className="w-5 h-5" />
            </Button>
            <Button size="lg" className="rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg">
                <Phone className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                <Video className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                <ScreenShare className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                <CircleDot className="w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm">
                <MoreVertical className="w-5 h-5" />
            </Button>
        </div>
    )
} 