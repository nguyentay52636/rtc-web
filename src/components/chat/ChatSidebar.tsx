import React from 'react'
import ChatHeader from './ChatHeader'
import ParticipantsList from './ParticipantsList'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { ChatSidebarProps } from '@/types/chat'
import ListOnlineUsers from '../ListOnlineUsers'

export default function ChatSidebar({
    participantCount = 3,
    onSendMessage
}: ChatSidebarProps) {
    return (
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
            <div className="flex flex-col h-full">
                <ChatHeader participantCount={participantCount} />
                <ParticipantsList />
                <ListOnlineUsers />
                <ChatMessages />
                <ChatInput onSendMessage={onSendMessage} />
            </div>
        </div>
    )
} 