import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageList } from "../message/MessageList";
import { MessageInput } from "../message/MessageInput";
import { PrivateConversationList } from "./PrivateConversationList";
import { Conversation, privateMessage } from "./type";
import { useMemo } from "react";

interface PrivateChatProps {
  messages: privateMessage[];
  conversations: Conversation[];
  selectedUser: string | null;
  currentUser: string;
  newMessage: string;
  newPrivateUser: string;
  onNewMessageChange: (msg: string) => void;
  onNewPrivateUserChange: (user: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onAddNewUser: () => void;
  onSelectUser: (user: string) => void;
  onBack: () => void;
  onContactAdded: (contact: { id: number; userName: string }) => void;
  sendError: string | null;
}

export function PrivateChat({
  messages,
  conversations,
  selectedUser,
  currentUser,
  newMessage,
  newPrivateUser,
  onNewMessageChange,
  onNewPrivateUserChange,
  onSendMessage,
  onAddNewUser,
  onSelectUser,
  onBack,
  onContactAdded,
  sendError
}: PrivateChatProps) {
  const selectedConversation = conversations.find(c => c.userName === selectedUser);
  const selectedAvatar = selectedConversation
    ? `/profilepicture/${selectedConversation.id}.webp`
    : "/default-avatar.webp";

  const filteredMessages = useMemo(() => {
    if (!selectedUser || !currentUser) return [];

    return messages
      .filter(msg => {
        if (!msg.isPrivate) return false;

        const userName = msg.user?.name?.toLowerCase();
        const recipientName = msg.recipient?.name?.toLowerCase();

        if (!userName || !recipientName) return false;

        const participants = [userName, recipientName];

        return (
          participants.includes(currentUser.toLowerCase()) &&
          participants.includes(selectedUser.toLowerCase())
        );
      })
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [messages, selectedUser, currentUser]);

  return (
    <div className="flex flex-col h-full">
      {!selectedUser ? (
        <PrivateConversationList
          conversations={conversations}
          newPrivateUser={newPrivateUser}
          onNewPrivateUserChange={onNewPrivateUserChange}
          onAddNewUser={onAddNewUser}
          onSelectUser={onSelectUser}
          onContactAdded={onContactAdded}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
              aria-label="Retour"
            >
              ←
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedAvatar} alt={selectedUser} />
              <AvatarFallback>
                {selectedUser.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedUser}</span>
          </div>

          <MessageList messages={filteredMessages} />

          {sendError && (
            <div className="text-red-500 text-sm text-center px-4 py-2">
              {sendError}
            </div>
          )}

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
