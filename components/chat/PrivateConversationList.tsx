import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type PrivateConversation = {
  userName: string
  avatar: string
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: Date
}

type PrivateConversationListProps = {
  conversations: PrivateConversation[]
  newPrivateUser: string
  onNewPrivateUserChange: (value: string) => void
  onAddNewUser: () => void
  onSelectUser: (userName: string) => void
}

export function PrivateConversationList({
  conversations,
  newPrivateUser,
  onNewPrivateUserChange,
  onAddNewUser,
  onSelectUser
}: PrivateConversationListProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex-1 overflow-y-auto max-h-[600px]">
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nouveau contact"
            value={newPrivateUser}
            onChange={(e) => onNewPrivateUserChange(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={onAddNewUser}
            disabled={!newPrivateUser.trim()}
          >
            Ajouter
          </Button>
        </div>
        
        <h3 className="text-lg font-medium mb-4">Conversations</h3>
        
        {conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.userName}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors relative"
                onClick={() => onSelectUser(conversation.userName)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">
                      {conversation.userName}
                    </span>
                    {conversation.lastMessageTime && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute right-3 top-3 h-5 w-5 flex items-center justify-center p-0"
                  >
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Aucune conversation privée
          </p>
        )}
      </div>
    </div>
  )
} 
