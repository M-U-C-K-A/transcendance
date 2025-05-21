import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type MessageProps = {
  message: {
    id: number
    user: {
      name: string
      avatar: string
    }
    text: string
    timestamp: Date
  }
}

export function Message({ message }: MessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.user.avatar} />
        <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <p className="text-sm text-foreground break-words whitespace-pre-wrap">
          {message.text}
        </p>
      </div>
    </div>
  )
} 
