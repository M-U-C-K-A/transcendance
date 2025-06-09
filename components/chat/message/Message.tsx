import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarDays } from "lucide-react";
import Link from "next/link";


type MessageProps = {
  message: {
    id: number
    user: {
      id: number
      name: string
      avatar: string
      win: number
      lose: number
      elo: number
    }
    recipient?: {
      id: number | null
      name: string | null
      avatar: string | null
      win: number | null
      lose: number | null
      elo: number | null
    }
    text: string
    timestamp: Date
    isPrivate: boolean
    isRead: boolean
  }
};

/**
 * Affiche un message de chat.
 *
 * @param {MessageProps} props
 * @prop {object} message
 * @prop {number} message.id
 * @prop {object} message.user
 * @prop {string} message.user.name
 * @prop {string} message.user.avatar
 * @prop {number} message.user.win
 * @prop {number} message.user.lose
 * @prop {number} message.user.elo
 * @prop {object} message.recipient
 * @prop {number} message.recipient.id
 * @prop {string} message.recipient.name
 * @prop {string} message.recipient.avatar
 * @prop {number} message.recipient.win
 * @prop {number} message.recipient.lose
 * @prop {number} message.recipient.elo
 * @prop {string} message.text
 * @prop {Date} message.timestamp
 * @prop {boolean} message.isPrivate
 * @prop {boolean} message.isRead
 *
 * @returns {JSX.Element}
 */
export function Message({ message }: MessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-start gap-3">
      <HoverCard>
        <HoverCardTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.user.avatar} alt={message.user.name} />
          <AvatarFallback> {message.user.name ? message.user.name.charAt(0).toUpperCase() : "?"} </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
          <AvatarImage src={message.user.avatar} />
          <AvatarFallback> {message.user.name ? message.user.name.charAt(0).toUpperCase() : "?"} </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{message.user.name}</h4>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  Victoires: {message.user.win} | Défaites: {message.user.lose} | Elo: {message.user.elo}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{message.user.name}</span>
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
