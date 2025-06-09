import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageCircle } from "lucide-react"
import { ChatComponent } from "@/components/chatComponent"
import { useI18n } from "@/i18n-client"

interface ChatSectionProps {
	currentUser: string
}

/**
 * A card component that contains a chat component.
 *
 * @param {ChatSectionProps} props The component props.
 * @param {string} props.currentUser The username of the current user.
 *
 * @returns {JSX.Element} The chat section component.
 */
export function ChatSection({ currentUser }: ChatSectionProps) {
	const t = useI18n()

	return (
		<Card className="bg-card border shadow-sm h-full max-h-[750px]">
			<CardHeader>
				<CardTitle className="flex items-center">
					<MessageCircle className="mr-2 h-5 w-5" /> {t('dashboard.chat.title')}
				</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent className="h-[calc(100%-60px)] mt-0">
				<ChatComponent
					placeholder={t('dashboard.chat.placeholder')}
					currentUser={currentUser}
				/>
			</CardContent>
		</Card>
	)
}
