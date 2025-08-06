import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  Send,
  MoreVertical,
  Users,
  Settings,
  Smile,
  Paperclip,
  Share2,
  ScreenShare,
  CircleDot,
  Hand,
  Shield,
  Calendar,
  Clock
} from 'lucide-react'

export default function VideoPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Team Meeting</h1>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Started 2:30 PM • 3 participants
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

        {/* Video Container */}
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

          {/* Video Controls */}
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

          {/* Security Badge */}
          <div className="absolute top-6 right-6">
            <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              End-to-end encrypted
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-semibold">Meeting Chat</h3>
                  <p className="text-gray-600 text-sm">3 participants</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Participants */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700 text-sm font-medium">Participants</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">John Doe</p>
                  <p className="text-gray-500 text-xs">Host</p>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Speaking
                </Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatars/02.png" />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm">
                    JS
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">Jane Smith</p>
                  <p className="text-gray-500 text-xs">Participant</p>
                </div>
                <div className="flex gap-2">
                  <Mic className="w-4 h-4 text-gray-400" />
                  <Video className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/avatars/03.png" />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm">
                    MJ
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm font-medium">Mike Johnson</p>
                  <p className="text-gray-500 text-xs">Participant</p>
                </div>
                <div className="flex gap-2">
                  <MicOff className="w-4 h-4 text-red-500" />
                  <VideoOff className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-900 font-medium text-sm">John Doe</span>
                  <span className="text-gray-500 text-xs">2:30 PM</span>
                </div>
                <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                  <p className="text-gray-800 text-sm">Hello everyone! Welcome to our meeting. 👋</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/02.png" />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs">
                  JS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-900 font-medium text-sm">Jane Smith</span>
                  <span className="text-gray-500 text-xs">2:31 PM</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-gray-800 text-sm">Hi John! Thanks for organizing this. 😊</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/03.png" />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                  MJ
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-900 font-medium text-sm">Mike Johnson</span>
                  <span className="text-gray-500 text-xs">2:32 PM</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-gray-800 text-sm">Can you hear me okay? My mic seems to be working now. 🎤</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-900 font-medium text-sm">John Doe</span>
                  <span className="text-gray-500 text-xs">2:33 PM</span>
                </div>
                <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                  <p className="text-gray-800 text-sm">Perfect! Let's start with the agenda. 📋</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Smile className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                className="flex-1 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
