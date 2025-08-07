"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Smile, Paperclip, Send } from 'lucide-react'

interface ChatInputProps {
    onSendMessage?: (message: string) => void
    placeholder?: string
}

export default function ChatInput({
    onSendMessage,
    placeholder = "Type a message..."
}: ChatInputProps) {
    const [message, setMessage] = useState('')

    const handleSend = () => {
        if (message.trim() && onSendMessage) {
            onSendMessage(message.trim())
            setMessage('')
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                    size="sm"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    onClick={handleSend}
                    disabled={!message.trim()}
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
} 