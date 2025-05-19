"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

type Message = {
  id: number
  user: {
    name: string
    avatar: string
  }
  text: string
  timestamp: Date
  isPrivate: boolean
  recipient?: string
  isRead: boolean
}

type PrivateConversation = {
  userName: string
  avatar: string
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: Date
}

interface ChatComponentProps {
  placeholder?: string
  currentUser: string
}

export function ChatComponent({ placeholder = "Écrivez un message...", currentUser }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"public" | "private">("public")
  const [selectedPrivateUser, setSelectedPrivateUser] = useState<string | null>(null)
  const [privateConversations, setPrivateConversations] = useState<PrivateConversation[]>([])
  const [newPrivateUser, setNewPrivateUser] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/chat/${currentUser}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      const transformedMessages = data.map((msg: any) => ({
        id: msg.id,
        user: { 
          name: msg.sender_username,
          avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${msg.sender_username}`
        },
        text: msg.content,
        timestamp: new Date(msg.sendAt),
        isPrivate: !msg.isGeneral,
        recipient: msg.recipient_username || undefined,
        isRead: msg.readStatus
      }));
      
      setMessages(transformedMessages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError("Impossible de se connecter au serveur de chat");
      // Option: Charger des données locales en cas d'échec
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize component and set up polling
  useEffect(() => {
    fetchMessages()
    
    const interval = setInterval(fetchMessages, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [currentUser])

  // Process private conversations
  useEffect(() => {
    const privateUsers = Array.from(
      new Set(
        messages
          .filter(msg => msg.isPrivate)
          .map(msg => msg.user.name === currentUser ? msg.recipient : msg.user.name)
          .filter(Boolean)
      )
    )

    const conversations = privateUsers.map(userName => {
      const userMessages = messages.filter(msg => 
        msg.isPrivate && 
        ((msg.user.name === userName && msg.recipient === currentUser) || 
         (msg.user.name === currentUser && msg.recipient === userName))
      )

      return {
        userName: userName as string,
        avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${userName}`,
        unreadCount: userMessages.filter(msg => 
          msg.user.name !== currentUser && 
          !msg.isRead
        ).length,
        lastMessage: userMessages[userMessages.length - 1]?.text,
        lastMessageTime: userMessages[userMessages.length - 1]?.timestamp
      }
    })

    setPrivateConversations(conversations)
  }, [messages, currentUser])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedPrivateUser])

  // Mark messages as read when opening private chat
  useEffect(() => {
    if (selectedPrivateUser) {
      setMessages(prev => prev.map(msg => 
        msg.isPrivate && 
        msg.user.name === selectedPrivateUser && 
        msg.recipient === currentUser && 
        !msg.isRead
          ? { ...msg, isRead: true }
          : msg
      ))
    }
  }, [selectedPrivateUser, currentUser])

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const isPrivate = activeTab === "private" && (selectedPrivateUser || newPrivateUser)
    const recipient = isPrivate ? (selectedPrivateUser || newPrivateUser) : undefined

    try {
      const response = await fetch(`${BACKEND_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: currentUser,
          recipient,
          content: newMessage,
          isGeneral: !isPrivate
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const sentMessage = await response.json()

      const message: Message = {
        id: sentMessage.id,
        user: { 
          name: currentUser, 
          avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${currentUser}`
        },
        text: newMessage,
        timestamp: new Date(sentMessage.sendAt),
        isPrivate: !!isPrivate,
        recipient,
        isRead: true
      }

      setMessages(prev => [...prev, message])
      setNewMessage("")

      if (newPrivateUser) {
        setSelectedPrivateUser(newPrivateUser)
        setNewPrivateUser("")
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setError("Échec de l'envoi du message. Veuillez réessayer.")
    }
  }

  // Helper functions
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const filteredMessages = messages.filter(msg => {
    if (activeTab === "public") return !msg.isPrivate
    if (!selectedPrivateUser) return false
    return msg.isPrivate && 
           ((msg.user.name === selectedPrivateUser && msg.recipient === currentUser) ||
            (msg.user.name === currentUser && msg.recipient === selectedPrivateUser))
  })

  if (isLoading) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        <p className="mt-4 text-muted-foreground">Chargement des messages...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-4 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchMessages}>Réessayer</Button>
      </div>
    )
  }
  return (
    <Tabs 
      defaultValue="public" 
      className="h-full flex flex-col"
      onValueChange={(value) => {
        setActiveTab(value as "public" | "private")
        if (value === "public") setSelectedPrivateUser(null)
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="public">Public</TabsTrigger>
        <TabsTrigger value="private">Privé</TabsTrigger>
      </TabsList>

      <TabsContent value="public" className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full max-h-[600px]">
          <div className="flex-1 overflow-y-auto mb-4 p-4 space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="flex items-start gap-3">
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
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
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
        <div className="flex flex-col h-full max-h-[600px]">
          {!selectedPrivateUser ? (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Nouveau contact"
                    value={newPrivateUser}
                    onChange={(e) => setNewPrivateUser(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => newPrivateUser.trim() && setSelectedPrivateUser(newPrivateUser.trim())}
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
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors relative"
                        onClick={() => setSelectedPrivateUser(conversation.userName)}
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
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPrivateUser(null)}
                  className="h-8 w-8"
                >
                  ←
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${selectedPrivateUser}`} />
                  <AvatarFallback>{selectedPrivateUser.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{selectedPrivateUser}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
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
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
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
