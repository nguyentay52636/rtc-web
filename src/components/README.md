# Component Structure

This project follows a feature-based component organization to improve maintainability and reusability.

## Directory Structure

```
src/components/
├── video/                    # Video-related components
│   ├── VideoArea.tsx        # Main video area container
│   ├── VideoHeader.tsx      # Meeting header with title and controls
│   ├── VideoContainer.tsx   # Video display area
│   ├── VideoControls.tsx    # Video control buttons
│   └── index.ts             # Export all video components
├── chat/                    # Chat-related components
│   ├── ChatSidebar.tsx      # Main chat sidebar container
│   ├── ChatHeader.tsx       # Chat header
│   ├── ParticipantsList.tsx # Participants list
│   ├── ChatMessages.tsx     # Chat messages display
│   ├── ChatInput.tsx        # Chat input with send functionality
│   └── index.ts             # Export all chat components
├── ui/                      # Reusable UI components
├── layout/                  # Layout components
└── types/                   # Shared TypeScript interfaces
    ├── video.ts             # Video-related types
    └── chat.ts              # Chat-related types
```

## Component Features

### Video Components
- **VideoArea**: Main container for video functionality
- **VideoHeader**: Displays meeting information and header controls
- **VideoContainer**: Handles video display and waiting state
- **VideoControls**: Video control buttons (mic, camera, etc.)

### Chat Components
- **ChatSidebar**: Main chat container
- **ChatHeader**: Chat header with participant count
- **ParticipantsList**: Displays meeting participants with status
- **ChatMessages**: Shows chat message history
- **ChatInput**: Message input with send functionality

## Benefits of This Structure

1. **Feature-based Organization**: Components are grouped by feature (video, chat)
2. **Reusability**: Each component can be reused independently
3. **Maintainability**: Smaller, focused components are easier to maintain
4. **Type Safety**: Shared TypeScript interfaces ensure consistency
5. **Clear Separation**: Video and chat functionality are clearly separated

## Usage Example

```tsx
import { VideoArea } from '@/components/video'
import { ChatSidebar } from '@/components/chat'

export default function VideoPage() {
  return (
    <div className="flex h-screen">
      <VideoArea 
        meetingTitle="Team Meeting"
        startTime="2:30 PM"
        participantCount={3}
      />
      <ChatSidebar 
        participantCount={3}
        onSendMessage={(message) => console.log(message)}
      />
    </div>
  )
}
``` 