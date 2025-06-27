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
  onSendInvitation?: () => void;
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
  onSendInvitation,
}: PrivateChatProps) {
  const selectedConversation = conversations.find(
	(c) => c.userName === selectedUser
  );

  const selectedAvatar = selectedConversation
	? selectedConversation.avatar
	: "/profilepicture/0.webp";

  const filteredMessages = useMemo(() => {
	return messages.filter(
	  (msg) =>
		msg.user.name === selectedUser ||
		(msg.recipient && msg.recipient.name === selectedUser)
	);
  }, [messages, selectedUser]);

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

		  <MessageList messages={filteredMessages} currentUser={currentUser} className="max-h-[450px]"/>

		  {sendError && (
			<div className="text-red-500 text-sm text-center px-4 py-2">
			  {sendError}
			</div>
		  )}

		  <MessageInput
			value={newMessage}
			onChange={onNewMessageChange}
			onSubmit={onSendMessage}
			isPrivate={true}
			recipientId={selectedConversation?.id}
		  />
		  {onSendInvitation && selectedUser && (
			<Button
			  className="mt-2"
			  variant="outline"
			  onClick={onSendInvitation}
			>
			  Inviter à rejoindre la partie
			</Button>
		  )}
		</>
	  )}
	</div>
  );
}
