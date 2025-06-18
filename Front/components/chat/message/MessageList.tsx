import { useRef, useEffect } from "react";
import { Message } from "./Message";

type MessageListProps = {
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
	currentUser: string;
	className?: string;
};

/**
 * Renders a list of messages and automatically scrolls to the bottom when new messages are added.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.messages - The list of messages to display, each containing an id, user details, text, and timestamp.
 * @param {string} props.currentUser - The name of the current user viewing the message list.
 * @param {string} props.className - Additional CSS classes to apply to the message list container.
 */
export function MessageList({ messages, currentUser, className = "" }: MessageListProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className={`flex-1 overflow-y-auto space-y-4 [&::-webkit-scrollbar]:w-2 ${className}`}>
			{messages.map((message, index) => (
			<Message key={message.id ?? index} message={message} currentUser={currentUser} />
		))}
			<div ref={messagesEndRef} />
		</div>
	);
}
