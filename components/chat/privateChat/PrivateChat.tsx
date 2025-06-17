import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageList } from "../message/MessageList";
import { MessageInput } from "../message/MessageInput";
import { PrivateConversationList } from "./PrivateConversationList";
import { Conversation, privateMessage } from "./type";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";

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
  sendError,
}: PrivateChatProps) {
  const selectedConversation = conversations.find(
    (c) => c.userName === selectedUser
  );
  const selectedAvatar = selectedConversation
    ? `/profilepicture/${selectedConversation.id}.webp`
    : "/profilepicture/0.webp";

  const filteredMessages = useMemo(() => {
    if (!selectedUser) return [];

    return messages.filter(msg => {
      const isSentMessage = msg.user.name === currentUser &&
                          msg.recipient?.name === selectedUser;
      const isReceivedMessage = msg.user.name === selectedUser &&
                              msg.recipient?.name === currentUser;
      return isSentMessage || isReceivedMessage;
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedUser, currentUser]);

  return (
    <div className="flex flex-col h-full justify-between">
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
          <div className="flex items-center gap-3 p-4 border-b h-[70px]">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
              aria-label="Retour"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedAvatar} alt={selectedUser ?? ""} />
              <AvatarFallback>
                {selectedUser?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedUser}</span>
          </div>

          <MessageList
            messages={filteredMessages}
            currentUser={currentUser}
            className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]"
            onInvitationClick={(content) => {
              if (content.includes("Rejoignez ma partie")) {
                fetch('/api/game/join', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reason: 'from-invite', content }),
                }).catch(console.error);
              }
            }}
          />

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
            isPrivate={true}
            recipientId={selectedConversation?.id}
          />
        </>
      )}
    </div>
  );
}
