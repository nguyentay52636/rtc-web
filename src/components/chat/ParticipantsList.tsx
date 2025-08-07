import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Mic, Video, MicOff, VideoOff } from 'lucide-react'

interface Participant {
    id: string
    name: string
    role: string
    avatar: string
    initials: string
    isSpeaking?: boolean
    isMuted?: boolean
    isVideoOff?: boolean
}

interface ParticipantsListProps {
    participants?: Participant[]
}

const defaultParticipants: Participant[] = [
    {
        id: '1',
        name: 'John Doe',
        role: 'Host',
        avatar: '/avatars/01.png',
        initials: 'JD',
        isSpeaking: true
    },
    {
        id: '2',
        name: 'Jane Smith',
        role: 'Participant',
        avatar: '/avatars/02.png',
        initials: 'JS'
    },
    {
        id: '3',
        name: 'Mike Johnson',
        role: 'Participant',
        avatar: '/avatars/03.png',
        initials: 'MJ',
        isMuted: true,
        isVideoOff: true
    }
]

export default function ParticipantsList({ participants = defaultParticipants }: ParticipantsListProps) {
    return (
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm font-medium">Participants</span>
            </div>
            <div className="space-y-3">
                {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
                                {participant.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="text-gray-900 text-sm font-medium">{participant.name}</p>
                            <p className="text-gray-500 text-xs">{participant.role}</p>
                        </div>
                        {participant.isSpeaking ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                                Speaking
                            </Badge>
                        ) : (
                            <div className="flex gap-2">
                                {participant.isMuted ? (
                                    <MicOff className="w-4 h-4 text-red-500" />
                                ) : (
                                    <Mic className="w-4 h-4 text-gray-400" />
                                )}
                                {participant.isVideoOff ? (
                                    <VideoOff className="w-4 h-4 text-red-500" />
                                ) : (
                                    <Video className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
} 