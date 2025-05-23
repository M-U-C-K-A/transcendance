import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAvatar } from '@dicebear/core';
import { botttsNeutral } from '@dicebear/collection';
import { useState, useEffect } from 'react';

// Cache simple en mémoire
const avatarCache = new Map<string, string>();

type MessageProps = {
  message: {
    id: number;
    user: {
      name: string;
    };
    text: string;
    timestamp: Date;
  };
};

export function Message({ message }: MessageProps) {
  const [avatarUri, setAvatarUri] = useState<string>('');
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    // Vérifier le cache d'abord
    if (avatarCache.has(message.user.name)) {
      setAvatarUri(avatarCache.get(message.user.name)!);
      return;
    }

    // Génération de l'avatar
    const svg = createAvatar(botttsNeutral, {
      seed: message.user.name,
      size: 80
    }).toString();

    const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    // Mettre en cache et mettre à jour l'état
    avatarCache.set(message.user.name, uri);
    setAvatarUri(uri);
  }, [message.user.name]);

  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        {avatarUri ? (
          <AvatarImage
            src={avatarUri}
            alt={`Avatar de ${message.user.name}`}
            loading="lazy"
            decoding="async"
            width="32"
            height="32"
          />
        ) : (
          <AvatarFallback className="animate-pulse">
            {message.user.name.charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
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
