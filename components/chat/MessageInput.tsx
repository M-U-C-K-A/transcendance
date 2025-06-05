import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { Invitation } from "@/components/chat/Invitation"

type MessageInputProps = {
	value: string
	onChange: (value: string) => void
	onSubmit: (e: React.FormEvent) => void
	placeholder?: string
}

/**
 * Renders a message input form for sending chat messages.
 *
 * @param {Object} props - The component props.
 * @param {string} props.value - The current value of the message input.
 * @param {function} props.onChange - Callback function to handle changes in the input value.
 * @param {function} props.onSubmit - Callback function to handle form submission.
 * @param {string} [props.placeholder="Écrivez un message..."] - Placeholder text for the input field.
 *
 * @returns {JSX.Element} The message input form component.
 */
export function MessageInput({ value, onChange, onSubmit, placeholder = "Écrivez un message..." }: MessageInputProps)
{
	return (
		<form onSubmit={onSubmit} className="flex gap-2 p-4 items-center">
			<Invitation/>
			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="flex-1"
			/>
			<Button type="submit" aria-label="Send message">
				<Send className="h-4 w-4" />
			</Button>
		</form>
	)
}

