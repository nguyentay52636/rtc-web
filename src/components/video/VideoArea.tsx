import React from 'react'
import VideoHeader from './VideoHeader'
import VideoContainer from './VideoContainer'
import VideoControls from './VideoControls'
import { VideoAreaProps } from '@/types/video'

export default function VideoArea({
    meetingTitle = "Team Meeting",
    startTime = "2:30 PM",
    participantCount = 3
}: VideoAreaProps) {
    return (
        <div className="flex-1 flex flex-col">
            <VideoHeader
                meetingTitle={meetingTitle}
                startTime={startTime}
                participantCount={participantCount}
            />
            <div className="flex-1 relative">
                <VideoContainer />
                <VideoControls />
            </div>
        </div>
    )
} 