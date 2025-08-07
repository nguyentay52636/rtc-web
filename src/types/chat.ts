export interface Participant {
  id: string
  name: string
  role: string
  avatar: string
  initials: string
  isSpeaking?: boolean
  isMuted?: boolean
  isVideoOff?: boolean
}

export interface Message {
  id: string
  sender: {
    name: string
    avatar: string
    initials: string
  }
  content: string
  timestamp: string
  isOwn?: boolean
}

export interface ChatSidebarProps {
  participantCount?: number
  onSendMessage?: (message: string) => void
} 