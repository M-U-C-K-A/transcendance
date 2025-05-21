import { useRef, useEffect } from "react"
import { Message } from "./Message"

type MessageListProps = {
  messages: Array<{
    id: number
    user: {
      name: string
      avatar: string
    }
    text: string
    timestamp: Date
  }>
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-4">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
} 
