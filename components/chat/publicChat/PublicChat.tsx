import { MessageList } from "../message/MessageList";
import { MessageInput } from "../message/MessageInput";

type PublicChatProps = {
  messages: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      avatar: string;
      win: number;
      lose: number;
      elo: number;
    };
    recipient?: {
      id: number | null;
      name: string | null;
      avatar: string | null;
      win: number | null;
      lose: number | null;
      elo: number | null;
    };
    text: string;
    timestamp: Date;
    isPrivate: boolean;
    isRead: boolean;
  }>;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  placeholder?: string;
  currentUser: string;
};

/**
 * Public chat component.
 *
 * This component renders a public chat interface. It displays a list of public
 * messages and a message input.
 *
 * @param {PublicChatProps} props The component props.
 * @returns {React.ReactElement} The public chat component.
 */
export function PublicChat({
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  placeholder,
  currentUser,
}: PublicChatProps) {
  return (
    <div className="flex flex-col h-full justify-between">
      <MessageList messages={messages} currentUser={currentUser} className="max-h-[520px]"/>
      <MessageInput
        value={newMessage}
        onChange={onNewMessageChange}
        onSubmit={onSendMessage}
        placeholder={placeholder}
      />
    </div>
  );
}
