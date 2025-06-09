import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

type MessageProps = {
  message: {
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
  };
};

export function Message({ message }: MessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-start gap-3">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link href={`/profile/${message.user.id}`}>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={message.user.avatar} alt={message.user.name} />
              <AvatarFallback>
                {message.user.name
                  ? message.user.name.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={message.user.avatar} />
              <AvatarFallback>
                {message.user.name
                  ? message.user.name.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Link
                href={`/profile/${message.user.id}`}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                {message.user.name}
              </Link>
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
          <Link
            href={`/profile/${message.user.id}`}
            className="font-medium text-foreground hover:underline"
          >
            {message.user.name}
          </Link>
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
