"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: number
  user: {
    name: string
    avatar?: string
  }
  text: string
  timestamp: Date
  isPrivate?: boolean
  recipient?: string
  isRead?: boolean
}

type PrivateConversation = {
  userName: string
  avatar?: string
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: Date
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
    text: "Je viens de terminer un tournoi, c'était intéressant avec beaucoup de participants et des matchs serrés.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 4,
    user: { name: "David" },
    text: "Quelqu'un peut m'aider à m'améliorer ? Je débute encore.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    id: 5,
    user: { name: "Alice", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alice" },
    text: "Salut, tu veux jouer contre moi ?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
    isPrivate: true,
    recipient: "John Doe",
    isRead: false
  },
  {
    id: 6,
    user: { name: "Bob" },
    text: "Je peux t'aider à t'améliorer si tu veux, j'ai beaucoup d'expérience dans ce jeu et je peux te donner des conseils personnalisés.",
    timestamp: new Date(Date.now() - 1000 * 30),
    isPrivate: true,
    recipient: "John Doe",
    isRead: false
  },
  { id: 7,
   user: { name: "Robz" },
   text: "salut bg !",
   timestamp: new Date(Date.now() - 1000 * 30),
   isPrivate: true,
   recipient: "John Doe",
   isRead: false
 },
 { id: 8,
  user: { name: "Robz" },
  text: "j'ai une question un peut bizzare 👉👈",
  timestamp: new Date(Date.now() - 1000 * 30),
  isPrivate: true,
  recipient: "John Doe",
  isRead: false
},
{ id: 9,
 user: { name: "Robz" },
 text: "tu peux m'envoyer une photo de tes pied ? 🥵 🦶🏾🦶🏾",
 timestamp: new Date(Date.now() - 1000 * 30),
 isPrivate: true,
 recipient: "John Doe",
 isRead: false
}
]

interface ChatComponentProps {
  placeholder?: string
}

export function ChatComponent({ placeholder = "Écrivez un message..." }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("public")
  const [selectedPrivateUser, setSelectedPrivateUser] = useState<string | null>(null)
  const [privateConversations, setPrivateConversations] = useState<PrivateConversation[]>([])
  const [newPrivateUser, setNewPrivateUser] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialiser les conversations privées
  useEffect(() => {
    const conversations: PrivateConversation[] = Array.from(
      new Set(
        messages
          .filter(msg => msg.isPrivate && msg.recipient === "John Doe")
          .map(msg => msg.user.name)
      )
    ).map(userName => {
      const userMessages = messages.filter(msg =>
        msg.isPrivate &&
        ((msg.user.name === userName && msg.recipient === "John Doe") ||
         (msg.user.name === "John Doe" && msg.recipient === userName))
      )

      return {
        userName,
        avatar: messages.find(msg => msg.user.name === userName)?.user.avatar,
        unreadCount: userMessages.filter(msg =>
          msg.user.name === userName &&
          msg.recipient === "John Doe" &&
          !msg.isRead
        ).length,
        lastMessage: userMessages[userMessages.length - 1]?.text,
        lastMessageTime: userMessages[userMessages.length - 1]?.timestamp
      }
    })

    setPrivateConversations(conversations)
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedPrivateUser])

  // Marquer les messages comme lus lorsqu'une conversation est sélectionnée
  useEffect(() => {
    if (selectedPrivateUser) {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.isPrivate &&
          msg.user.name === selectedPrivateUser &&
          msg.recipient === "John Doe" &&
          !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      )
    }
  }, [selectedPrivateUser])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const isPrivate = activeTab === "private" && (selectedPrivateUser || newPrivateUser)
    const recipient = isPrivate ? (selectedPrivateUser || newPrivateUser) : undefined

    const message: Message = {
      id: messages.length + 1,
      user: { name: "John Doe", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD" },
      text: newMessage,
      timestamp: new Date(),
      isPrivate: !!isPrivate,
      recipient,
      isRead: true
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Si c'est un nouveau contact privé, l'ajouter à la liste
    if (isPrivate && newPrivateUser && !privateConversations.some(c => c.userName === newPrivateUser)) {
      setPrivateConversations(prev => [
        ...prev,
        {
          userName: newPrivateUser,
          unreadCount: 0,
          lastMessage: newMessage,
          lastMessageTime: new Date()
        }
      ])
      setSelectedPrivateUser(newPrivateUser)
      setNewPrivateUser("")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { day: "numeric", month: "short" })
  }

  const filteredMessages = messages.filter(msg => {
    if (activeTab === "public") return !msg.isPrivate
    if (activeTab === "private") {
      if (!selectedPrivateUser) return false
      return msg.isPrivate &&
             ((msg.user.name === selectedPrivateUser && msg.recipient === "John Doe") ||
              (msg.user.name === "John Doe" && msg.recipient === selectedPrivateUser))
    }
    return true
  })

  return (
    <Tabs defaultValue="public" className="h-full flex flex-col" onValueChange={(value) => {
      setActiveTab(value)
      if (value === "public") setSelectedPrivateUser(null)
    }}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="public">Public</TabsTrigger>
        <TabsTrigger value="private">Privé</TabsTrigger>
      </TabsList>

      <TabsContent value="public" className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-3">
            {filteredMessages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.user.avatar || "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD"} />
                  <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.user.name}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-sm text-foreground break-words whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2 p-3">
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
      </TabsContent>

      <TabsContent value="private" className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {!selectedPrivateUser ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-3">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Nouveau contact"
                    value={newPrivateUser}
                    onChange={(e) => setNewPrivateUser(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (newPrivateUser.trim()) {
                        setSelectedPrivateUser(newPrivateUser)
                        setNewPrivateUser("")
                      }
                    }}
                    disabled={!newPrivateUser.trim()}
                  >
                    Ajouter
                  </Button>
                </div>
                <h3 className="text-lg font-medium mb-4">Conversations</h3>
                {privateConversations.length > 0 ? (
                  <div className="space-y-2">
                    {privateConversations.map((conversation) => (
                      <div
                        key={conversation.userName}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded cursor-pointer relative"
                        onClick={() => setSelectedPrivateUser(conversation.userName)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar || `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${conversation.userName}`} />
                          <AvatarFallback>{conversation.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-medium truncate">{conversation.userName}</span>
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
                          <Badge className="absolute right-3 top-3" variant="destructive">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aucune conversation privée</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 p-3 border-b">
                <button
                  onClick={() => setSelectedPrivateUser(null)}
                  className="mr-2"
                >
                  ←
                </button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={messages.find(m => m.user.name === selectedPrivateUser)?.user.avatar || `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${selectedPrivateUser}`} />
                  <AvatarFallback>{selectedPrivateUser.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{selectedPrivateUser}</span>
              </div>
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-3">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.user.avatar || "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD"} />
                      <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.user.name}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                      </div>
                      <p className="text-sm text-foreground break-words whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2 p-3">
                <Input
                  placeholder={`Message à ${selectedPrivateUser}`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
