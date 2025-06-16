import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Swords } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { sendMessageData } from "@/server/request/chat/interface";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  isPrivate?: boolean;
  recipientId?: number;
};

export function MessageInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Écrivez un message...",
  isPrivate = false,
  recipientId
}: MessageInputProps) {
  const [hasGame, setHasGame] = useState(false);
  const [gameData, setGameData] = useState({ id: '', name: '' });

  useEffect(() => {
    const gameID = localStorage.getItem('currentGameId');
    const gameNAME = localStorage.getItem('currentGameName');

    if (gameID && gameNAME) {
      setHasGame(true);
      setGameData({ id: gameID, name: gameNAME });
    }
  }, []);

  const handleGameClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasGame) return;

    const content = `${gameData.id}`;
    const messageType = 'INVITATION';

    const payload: sendMessageData = {
      content,
      messageType,
      ...(isPrivate && recipientId && { recipient: recipientId }),
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Erreur lors de l'envoi du message de jeu", response.statusText);
      } else {
        onChange('');
        onSubmit(e); // Trigger message list refresh
      }
    } catch (error) {
      console.error("Erreur réseau lors de l'envoi du message de jeu", error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 p-2 items-center border-t-1 w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {hasGame ? (
              <Button
                variant="outline"
                size="icon"
                className="opacity-100 cursor-pointer"
                onClick={handleGameClick}
                aria-label="Partager une partie"
                type="button"
              >
                <Swords className="h-4 w-4" />
              </Button>
            ) : (
              <span className="border opacity-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 cursor-not-allowed">
                <Swords />
              </span>
            )}
          </TooltipTrigger>
          <TooltipContent>
            {hasGame ? "Partager une partie" : "Lancer une partie"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
  );
}
