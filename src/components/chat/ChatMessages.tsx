import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Message } from '@/types/chat'

interface ChatMessagesProps {
    messages?: Message[]
}

const defaultMessages: Message[] = [
    {
        id: '1',
        sender: {
            name: 'John Doe',
            avatar: '/avatars/01.png',
            initials: 'JD'
        },
        content: 'Hello everyone! Welcome to our meeting. 👋',
        timestamp: '2:30 PM'
    },
    {
        id: '2',
        sender: {
            name: 'Jane Smith',
            avatar: '/avatars/02.png',
            initials: 'JS'
        },
        content: 'Hi John! Thanks for organizing this. 😊',
        timestamp: '2:31 PM'
    },
    {
        id: '3',
        sender: {
            name: 'Mike Johnson',
            avatar: '/avatars/03.png',
            initials: 'MJ'
        },
        content: 'Can you hear me okay? My mic seems to be working now. 🎤',
        timestamp: '2:32 PM'
    },
    {
        id: '4',
        sender: {
            name: 'John Doe',
            avatar: '/avatars/01.png',
            initials: 'JD'
        },
        content: 'Perfect! Let\'s start with the agenda. 📋',
        timestamp: '2:33 PM'
    }
]

export default function ChatMessages({ messages = defaultMessages }: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
                <div key={message.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                            {message.sender.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-gray-900 font-medium text-sm">{message.sender.name}</span>
                            <span className="text-gray-500 text-xs">{message.timestamp}</span>
                        </div>
                        <div className={`rounded-2xl p-3 border ${message.isOwn
                                ? 'bg-blue-50 border-blue-100'
                                : 'bg-gray-50 border-gray-100'
                            }`}>
                            <p className="text-gray-800 text-sm">{message.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
} 