import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Share2, Calendar, Shield } from 'lucide-react'

export default function VideoContainer() {
    return (
        <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 m-6 rounded-2xl overflow-hidden shadow-lg">
            {/* Main Video */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-600">
                    <div className="w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
                        <Video className="w-20 h-20 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Waiting for participants...</h2>
                    <p className="text-gray-500 mb-6">Share this link to invite others to join</p>
                    <div className="flex justify-center gap-3">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                            <Share2 className="w-4 h-4 mr-2" />
                            Copy Link
                        </Button>
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule
                        </Button>
                    </div>
                </div>
            </div>

            {/* Security Badge */}
            <div className="absolute top-6 right-6">
                <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    End-to-end encrypted
                </Badge>
            </div>
        </div>
    )
} 