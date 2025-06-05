import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarIcon } from "lucide-react";


type MessageProps = {
	message: {
		id: number;
		user: {
			name: string;
			id: number;
		};
		text: string;
		timestamp: Date;
	};
};

/**
 * Affiche un message de chat.
 *
 * @param {MessageProps} props
 * @prop {object} message
 * @prop {number} message.id
 * @prop {object} message.user
 * @prop {string} message.user.name
 * @prop {string} message.text
 * @prop {Date} message.timestamp
 *
 * @returns {JSX.Element}
 */
export function Message({ message }: MessageProps) {
	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<div className="flex items-start gap-3">
			<Avatar className="h-8 w-8">
					<AvatarImage
						src={`/profilepicture/${message.user.id}.webp`}
						alt={`Avatar de ${message.user.name}`}
						loading="lazy"
						decoding="async"
						width="32"
						height="32"
					/>
					<AvatarFallback className="animate-pulse">
						{message.user.name?.split(' ')[0][0].toUpperCase()}
						{message.user.name?.split(' ')[0][1].toUpperCase()}
					</AvatarFallback>
			</Avatar>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
						<HoverCard>
							<HoverCardTrigger>
								<span className="font-medium">{message.user.name}</span></HoverCardTrigger>
							<HoverCardContent>
								<div className="flex justify-between space-x-4">
									<Avatar className="h-8 w-8">
											<AvatarImage
												src={`/profilepicture/${message.user.id}.webp`}
												alt={`Avatar de ${message.user.name}`}
												loading="lazy"
												decoding="async"
												width="32"
												height="32"
											/>
											<AvatarFallback className="animate-pulse">
						{message.user.name?.split(' ')[0][0].toUpperCase()}
						{message.user.name?.split(' ')[0][1].toUpperCase()}
											</AvatarFallback>
									</Avatar>
									<div className="space-y-1">
										<h4 className="text-sm font-semibold">{message.user.name}</h4>
										<p className="text-sm">
											Click to view his profile
										</p>
										<div className="flex items-center pt-2">
											<CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
											<span className="text-xs text-muted-foreground">
												{message.timestamp.toLocaleDateString()}
											</span>
										</div>
									</div>
								</div>
							</HoverCardContent>
						</HoverCard>
					<span className="text-xs text-muted-foreground">
						{formatTime(message.timestamp)}
					</span>
				</div>
				<p className="text-sm text-foreground break-words whitespace-pre-wrap">
					{message.text}
				</p>
			</div>
		</div>
	);
}

