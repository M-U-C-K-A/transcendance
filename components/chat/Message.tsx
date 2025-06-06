import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CalendarIcon } from "lucide-react";
import Link from "next/link";


type MessageProps = {
  message: {
    id: number;
    user: {
      name: string;
      id: number;
      username: string; // Ajout d'un champ username pour l'URL
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
 * @prop {string} message.user.username
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
      <Link href={`/profile/${message.user.name}`} passHref>
        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
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
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`/profile/${message.user.name}`}
                className="font-medium hover:underline cursor-pointer"
              >
                {message.user.name}
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`/profilepicture/${message.user.id}.webp`}
                    alt={`Avatar de ${message.user.name}`}
                  />
                  <AvatarFallback>
                    {message.user.name?.split(' ')[0][0].toUpperCase()}
                    {message.user.name?.split(' ')[0][1].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 w-full">
                  <h4 className="text-sm font-semibold">{message.user.name}</h4>
				  <p className="text-sm text-muted-foreground max-w-[150px] truncate overflow-hidden">
					{message.text}
					</p>
                  <div className="flex items-center pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      Membre depuis {message.timestamp.toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  <Link
                    href={`/profile/${message.user.name}`}
                    className="inline-block mt-2 text-sm font-medium text-primary hover:underline"
                  >
                    Voir le profil complet →
                  </Link>
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
