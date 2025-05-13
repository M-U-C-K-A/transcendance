"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"

type Message = {
  id: number
  user: {
    name: string
    avatar?: string
  }
  text: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: 1,
    user: { name: "Alice", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alice" },
    text: "Bonjour à tous ! Qui est disponible pour une partie ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 2,
    user: { name: "Bob" },
    text: "Je suis disponible pour un match rapide !",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: 3,
    user: { name: "Charlie", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Bob" },
    text: "Je viens de terminer un tournoi, c'était intéressant.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 4,
    user: { name: "David" },
    text: "Quelqu'un peut m'aider à m'améliorer ? Je débute encore.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
]

interface ChatComponentProps {
  placeholder?: string
}

export function ChatComponent({ placeholder = "Écrivez un message..." }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const message: Message = {
      id: messages.length + 1,
      user: { name: "John Doe", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD" },
      text: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.user.avatar || "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD"} />
              <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.user.name}</span>
                <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
              </div>
              <p className="text-sm text-foreground">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
