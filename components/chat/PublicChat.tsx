import { MessageList } from "./MessageList"
import { MessageInput } from "./MessageInput"

type PublicChatProps = {
	messages: Array<{
		id: number
		user: {
			name: string
			avatar: string
		}
		text: string
		timestamp: Date
	}>
	newMessage: string
	onNewMessageChange: (value: string) => void
	onSendMessage: (e: React.FormEvent) => void
	placeholder?: string
}

/**
 * Public chat component.
 *
 * This component renders a public chat interface. It displays a list of public
 * messages and a message input.
 *
 * @param {PublicChatProps} props The component props.
 * @param {Array} props.messages The list of public messages.
 * @param {string} props.newMessage The current value of the new message.
 * @param {(value: string) => void} props.onNewMessageChange Callback function to
 *   handle changes in the new message input.
 * @param {(e: React.FormEvent) => void} props.onSendMessage Callback function to
 *   handle sending a new message.
 * @param {string} [props.placeholder=""] Placeholder text for the message input.
 *
 * @returns {React.ReactElement} The public chat component.
 */
export function PublicChat({
	messages,
	newMessage,
	onNewMessageChange,
	onSendMessage,
	placeholder
}: PublicChatProps) {
	return (
		<div className="flex flex-col h-full">
			<MessageList messages={messages} />
				<MessageInput
					value={newMessage}
					onChange={onNewMessageChange}
					onSubmit={onSendMessage}
					placeholder={placeholder}
				/>
		</div>
	)
}

