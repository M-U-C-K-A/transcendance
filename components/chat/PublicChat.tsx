import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"

type PublicChatProps = {
  messages: Array<{
    id: number
    user: {
      name: string
      avatar: string
    }
    text: string
    timestamp: Date
  }>
  newMessage: string
  onNewMessageChange: (value: string) => void
  onSendMessage: (e: React.FormEvent) => void
  placeholder?: string
}

export function PublicChat({
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  placeholder
}: PublicChatProps) {
  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages}/>
      <MessageInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSubmit={onSendMessage}
        placeholder={placeholder}
      />
    </div>
  )
} 
