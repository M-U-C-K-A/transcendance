"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Trophy } from "lucide-react"

type Message = {
  id: number
  user: {
    name: string
    avatar?: string
    elo?: number
    wins?: number
    losses?: number
    winRate?: string
  }
  text: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: 1,
    user: {
      name: "Alice",
      avatar: "/placeholder.svg?height=40&width=40",
      elo: 1850,
      wins: 82,
      losses: 38,
      winRate: "68%",
    },
    text: "Bonjour à tous ! Qui est disponible pour une partie ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 2,
    user: {
      name: "Bob",
      elo: 1780,
      wins: 68,
      losses: 27,
      winRate: "72%",
    },
    text: "Je suis disponible pour un match rapide !",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: 3,
    user: {
      name: "Charlie",
      avatar: "/placeholder.svg?height=40&width=40",
      elo: 1720,
      wins: 71,
      losses: 39,
      winRate: "65%",
    },
    text: "Je viens de terminer un tournoi, c'était intéressant.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 4,
    user: {
      name: "David",
      elo: 1580,
      wins: 43,
      losses: 32,
      winRate: "58%",
    },
    text: "Quelqu'un peut m'aider à m'améliorer ? Je débute encore.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
]

export function ChatComponent() {
  const router = useRouter()
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
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
        elo: 1600,
        wins: 51,
        losses: 34,
        winRate: "60%",
      },
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
            <HoverCard>
              <HoverCardTrigger asChild>
                <Avatar
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => router.push(`/profile/${message.user.name.toLowerCase()}`)}
                >
                  <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <Avatar>
                    <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-sm font-semibold">{message.user.name}</h4>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-muted-foreground">ELO: {message.user.elo}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <span className="text-green-500 font-medium mr-1">{message.user.wins}W</span>
                        <span className="text-red-500 font-medium">{message.user.losses}L</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">Win rate: {message.user.winRate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex mt-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/profile/${message.user.name.toLowerCase()}`)}
                  >
                    Voir profil
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => router.push(`/profile/${message.user.name.toLowerCase()}`)}
                    >
                      {message.user.name}
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between space-x-4">
                      <Avatar>
                        <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-sm font-semibold">{message.user.name}</h4>
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-muted-foreground">ELO: {message.user.elo}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <span className="text-green-500 font-medium mr-1">{message.user.wins}W</span>
                            <span className="text-red-500 font-medium">{message.user.losses}L</span>
                          </div>
                          <div className="text-right">
                            <span className="text-muted-foreground">Win rate: {message.user.winRate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex mt-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/profile/${message.user.name.toLowerCase()}`)}
                      >
                        Voir profil
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
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
          placeholder="Écrivez un message..."
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
