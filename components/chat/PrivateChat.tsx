import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"
import { PrivateConversationList } from "./PrivateConversationList"

type PrivateChatProps = {
  messages: Array<{
    id: number
    user: {
      name: string
      avatar: string
    }
    text: string
    timestamp: Date
  }>
  conversations: Array<{
    userName: string
    avatar: string
    unreadCount: number
    lastMessage?: string
    lastMessageTime?: Date
  }>
  selectedUser: string | null
  newMessage: string
  newPrivateUser: string
  onNewMessageChange: (value: string) => void
  onNewPrivateUserChange: (value: string) => void
  onSendMessage: (e: React.FormEvent) => void
  onAddNewUser: () => void
  onSelectUser: (userName: string) => void
  onBack: () => void
}

export function PrivateChat({
  messages,
  conversations,
  selectedUser,
  newMessage,
  newPrivateUser,
  onNewMessageChange,
  onNewPrivateUserChange,
  onSendMessage,
  onAddNewUser,
  onSelectUser,
  onBack
}: PrivateChatProps) {
  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {!selectedUser ? (
        <PrivateConversationList
          conversations={conversations}
          newPrivateUser={newPrivateUser}
          onNewPrivateUserChange={onNewPrivateUserChange}
          onAddNewUser={onAddNewUser}
          onSelectUser={onSelectUser}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              ←
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${selectedUser}`} />
              <AvatarFallback>{selectedUser.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedUser}</span>
          </div>
          
          <MessageList messages={messages} />
          
          <MessageInput
            value={newMessage}
            onChange={onNewMessageChange}
            onSubmit={onSendMessage}
            placeholder={`Message à ${selectedUser}`}
          />
        </>
      )}
    </div>
  )
} 
