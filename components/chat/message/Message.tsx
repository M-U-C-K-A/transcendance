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
    typeMessage: string;
  };
  currentUser: string;
};

const formatUser = (user: {
  id: number | null;
  name: string | null;
  avatar: string | null;
  win: number | null;
  lose: number | null;
  elo: number | null;
}): {
  id: number;
  name: string;
  avatar: string;
  win: number;
  lose: number;
  elo: number;
} => {
  return {
    id: user.id ?? 0,
    name: user.name ?? "Unknown",
    avatar: user.avatar ?? "",
    win: user.win ?? 0,
    lose: user.lose ?? 0,
    elo: user.elo ?? 1000,
  };
};

export function Message({ message, currentUser }: MessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isSender = message.user.name === currentUser;

  let displayUser = message.user;
  if (message.isPrivate && !isSender && message.recipient) {
    displayUser = formatUser(message.recipient);
  }
  // Log message data in a styled console.table for debugging
  if (typeof window !== "undefined" && message) {
    const styleHeader = "color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 3px;";
    const styleRow = "color: #334155; background: #e0e7ff; padding: 2px 6px; border-radius: 3px;";
    // Prepare a flat object for console.table
    const logData = {
      ID: message.id,
      Sender: message.user.name,
      Recipient: message.recipient?.name ?? "-",
      Text: message.text,
      Time: formatTime(message.timestamp),
      Private: message.isPrivate ? "Oui" : "Non",
      Read: message.isRead ? "Oui" : "Non",
      typeMessage: message.typeMessage ?? "message",
    };
    // Print styled header
    console.log("%cMessage Debug", styleHeader);
    // Print table
    console.table([logData]);
  }

  if (message.typeMessage === "INVITATION") {
    return (
      <div className="flex items-center justify-center w-full my-4">
        <div className="bg-card border rounded-lg p-4 shadow-md flex flex-col items-center">
          <span className="mb-2 flex gap-2 items-center">
            {displayUser.name}
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback>
                {displayUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </span>
          <Link
            href={`/game/invite/${message.text}`}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
          >
            Rejoindre la partie
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <HoverCard>
        <HoverCardTrigger asChild>
          <Link href={`/profile/${displayUser.id}`}>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback>
                {displayUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src={displayUser.avatar} />
              <AvatarFallback>
                {displayUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Link
                href={`/profile/${displayUser.id}`}
                className="text-sm font-semibold text-foreground hover:underline"
              >
                {displayUser.name}
              </Link>
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                <span className="text-xs text-muted-foreground">
                  Victoires: {displayUser.win} | Défaites: {displayUser.lose} | Elo: {displayUser.elo}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${displayUser.id}`}
            className="font-medium text-foreground hover:underline"
          >
            {displayUser.name}
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
