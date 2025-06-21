import { Dispatch, SetStateAction, useEffect } from "react";
import { useI18n } from "@/i18n-client";

type Player = 1 | 2 | 3 | 4;

interface ColorChoiceProps {
  COLORS: string[];
  currentPlayer: Player;
  setCurrentPlayer: Dispatch<SetStateAction<Player>>;
  colorP1: string | null;
  setColorP1: Dispatch<SetStateAction<string | null>>;
  colorP2: string | null;
  setColorP2: Dispatch<SetStateAction<string | null>>;
  colorP3: string | null;
  setColorP3: Dispatch<SetStateAction<string | null>>;
  colorP4: string | null;
  setColorP4: Dispatch<SetStateAction<string | null>>;
  enableAI?: boolean;
  is2v2Mode: boolean;
}

export default function ColorChoice({
  COLORS,
  currentPlayer,
  setCurrentPlayer,
  colorP1,
  setColorP1,
  colorP2,
  setColorP2,
  colorP3,
  setColorP3,
  colorP4,
  setColorP4,
  enableAI = false,
  is2v2Mode,
}: ColorChoiceProps) {
  const t = useI18n();

  useEffect(() => {
    if (enableAI) {
      setColorP2("#FFFFFF"); // Met la couleur de l'IA à blanc par défaut
      if (currentPlayer === 2) {
        setCurrentPlayer(1); // Repasse au joueur 1 si c'était au tour de l'IA
      }
    }
  }, [enableAI, setColorP2, setCurrentPlayer, currentPlayer]);

  const handleSetColor = (hex: string) => {
    switch (currentPlayer) {
      case 1: setColorP1(hex); break;
      case 2: setColorP2(hex); break;
      case 3: setColorP3(hex); break;
      case 4: setColorP4(hex); break;
    }
  };

  const getPlayerColor = (player: Player) => {
    switch (player) {
      case 1: return colorP1;
      case 2: return colorP2;
      case 3: return colorP3;
      case 4: return colorP4;
    }
  }

  const isColorTaken = (hex: string) => {
    return colorP1 === hex || colorP2 === hex || colorP3 === hex || colorP4 === hex;
  };

  const PlayerButton = ({ player, label }: { player: Player, label: string }) => {
    // Le joueur 2 est désactivé si l'IA est activée
    const isPlayer2Disabled = player === 2 && enableAI;
    // Les joueurs 3 et 4 sont désactivés si le mode 2v2 n'est PAS activé
    const isPlayer34Disabled = (player === 3 || player === 4) && !is2v2Mode;
    const isDisabled = isPlayer2Disabled || isPlayer34Disabled;

    return (
      <button
        onClick={() => !isDisabled && setCurrentPlayer(player)}
        disabled={isDisabled}
        className={`px-4 py-2 rounded-lg font-semibold ${
          currentPlayer === player
            ? "bg-yellow-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-center space-x-4">
        {is2v2Mode ? (
          <>
            <div className="flex flex-col items-center space-y-2">
              <span className="font-bold text-blue-500">Équipe 1</span>
              <div className="flex space-x-2">
                <PlayerButton player={1} label="J1" />
                <PlayerButton player={3} label="J3" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <span className="font-bold text-red-500">Équipe 2</span>
              <div className="flex space-x-2">
                <PlayerButton player={2} label="J2" />
                <PlayerButton player={4} label="J4" />
              </div>
            </div>
          </>
        ) : (
          <>
            <PlayerButton player={1} label={`🎖️ ${t('game.create.player1')}`} />
            <PlayerButton player={2} label={`${enableAI ? "🤖" : "🎖️"} ${t('game.create.player2')} ${enableAI ? "(IA)" : ""}`} />
          </>
        )}
      </div>

      <div className="text-center mb-4 text-lg font-medium text-foreground">
        {t('game.create.colorfor')} {" "}
        <span className="font-bold">
          {`Joueur ${currentPlayer}`}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mx-auto">
          {COLORS.map((hex) => { 
            const takenBy = [colorP1, colorP2, colorP3, colorP4].indexOf(hex) + 1;
            const isDisabled = isColorTaken(hex) && getPlayerColor(currentPlayer) !== hex;

              return (
              <button
                key={hex}
                onClick={() => handleSetColor(hex)}
                disabled={isDisabled}
                aria-label={`Couleur ${hex} ${isDisabled ? "(déjà prise)" : ""}`}
                className="relative h-12 w-12 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: hex,
                  opacity: isDisabled ? 0.4 : 1,
                  border: getPlayerColor(currentPlayer) === hex
                    ? "3px solid yellow"
                    : "2px solid transparent"
                }}
              >
                {takenBy > 0 && (
                  <span className="absolute -top-1 -left-1 bg-foreground text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {takenBy}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}