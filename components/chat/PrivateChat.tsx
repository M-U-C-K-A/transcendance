import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { PrivateConversationList } from "./PrivateConversationList";

// Définition du type PrivateChatProps
type PrivateChatProps = {
  messages: Array<{
    id: number;
    user: {
      name: string;
      avatar: string;
    };
    text: string;
    timestamp: Date;
  }>;
  conversations: Array<{
    id: number;
    userName: string;
    avatar: string;
    unreadCount: number;
    lastMessage?: string;
    lastMessageTime?: Date;
  }>;
  selectedUser: string | null;
  newMessage: string;
  newPrivateUser: string;
  onNewMessageChange: (value: string) => void;
  onNewPrivateUserChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onAddNewUser: () => void;
  onSelectUser: (userName: string) => void;
  onBack: () => void;
};

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
  onBack,
}: PrivateChatProps) {
  const [conversationsList, setConversationsList] = useState(conversations);

  const handleContactAdded = (contact: { id: number; userName: string }) => {
    setConversationsList(prev => [
      ...prev,
      {
        id: contact.id,
        userName: contact.userName,
        avatar: `/public/profilepicture/${contact.id}.webp`,
        unreadCount: 0,
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {!selectedUser ? (
        <PrivateConversationList
          conversations={conversationsList}
          newPrivateUser={newPrivateUser}
          onNewPrivateUserChange={onNewPrivateUserChange}
          onAddNewUser={onAddNewUser}
          onSelectUser={onSelectUser}
          onContactAdded={handleContactAdded}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 border-b max-h-[600px]">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              ←
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`/profilepicture/${conversationsList.find(c => c.userName === selectedUser)?.id}.webp`}
                alt={selectedUser}
              />
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
  );
}
