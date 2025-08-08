"use client"

import React from 'react'
import VideoArea from '@/components/video/VideoArea'
import ChatSidebar from '@/components/chat/ChatSidebar'
import SocketTest from '@/components/SocketTest'
import VideoCallTest from '@/components/VideoCallTest'

export default function VideoPage() {
  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message)
    // TODO: Implement message sending logic
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <VideoArea
        meetingTitle="Team Meeting"
        startTime="2:30 PM"
        participantCount={3}
      />
      <ChatSidebar
        participantCount={3}
        onSendMessage={handleSendMessage}
      />
      <SocketTest />
      <VideoCallTest />
    </div>
  )
}
