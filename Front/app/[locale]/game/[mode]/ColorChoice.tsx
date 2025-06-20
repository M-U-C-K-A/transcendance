import { Dispatch, SetStateAction, useEffect } from "react";
import { useI18n } from "@/i18n-client";




// Dispatch  recoit une action qui prend en param 1 / 2

interface ColorChoiceProps {
  COLORS: string[];
  currentPlayer: 1 | 2;
  setCurrentPlayer: Dispatch<SetStateAction<1 | 2>>;
  colorP1: string | null;
  setColorP1: Dispatch<SetStateAction<string | null>>;
  colorP2: string | null;
  setColorP2: Dispatch<SetStateAction<string | null>>;
  enableAI?: boolean;
}




export default function ColorChoice({
  COLORS,
  currentPlayer,
  setCurrentPlayer,
  colorP1,
  setColorP1,
  colorP2,
  setColorP2,
  enableAI = false,
}: ColorChoiceProps) {

  const t = useI18n();

  useEffect(() => {
    if (enableAI) {
      setColorP2("#000000"); // Met la couleur de l'IA à noir par défaut
      if(currentPlayer === 2) {
        setCurrentPlayer(1); // Repasse au joueur 1 si c'était au tour de l'IA
      }
    }
  }, [enableAI, setColorP2, setCurrentPlayer, currentPlayer]);

  return (


    <div className="space-y-4">



      {/* couleurs joueurs . met le current player + met en jaune*/}
      <div className="mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentPlayer(1)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentPlayer === 1
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🎖️ {t('game.create.player1')}
        </button>


        <button
          onClick={() => !enableAI && setCurrentPlayer(2)}
          disabled={enableAI}
          className={`px-4 py-2 rounded-lg font-semibold ${
            currentPlayer === 2
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          } ${enableAI ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          🎖️ {t('game.create.player2')} {enableAI ? "(IA)" : ""}
        </button>
      </div>






      <div className="text-center mb-4 text-lg font-medium text-foreground">
        {t('game.create.colorfor')} {" "}
        <span className="font-bold">
          {currentPlayer === 1 ? t('game.create.player1') : t('game.create.player2')}
        </span>
      </div>









      <div className="flex justify-center">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mx-auto">

          {/* colors utilise map qui prend les 6 couleur definit dans page.tsx*/}
          {/* map sa parcorout les 6 et applique la meme chose a toute */}
  
          {COLORS.map((hex) => { 
            const takenByP1 = colorP1 === hex;
            const takenByP2 = colorP2 === hex;
            const isDisabled =
              (currentPlayer === 1 && takenByP2) ||
              (currentPlayer === 2 && takenByP1);
            


              return (
              <button
                key={hex}
                onClick={() => {

                  if (currentPlayer === 1) 
                    setColorP1(hex);

                  else 
                    setColorP2(hex);
                }}

                disabled={isDisabled}
                aria-label={`Couleur ${hex} ${isDisabled ? "(déjà prise)" : ""}`}
                className="relative h-12 w-12 rounded-lg focus:outline-none"

                style={{
                  backgroundColor: hex,
                  opacity: isDisabled ? 0.4 : 1,
                  border: (currentPlayer === 1 && colorP1 === hex) || (currentPlayer === 2 && colorP2 === hex)
                    ? "3px solid yellow"
                    : "2px solid transparent"
                }}
              >

                {(takenByP1 || takenByP2) && (
                  <span className="absolute -top-1 -left-1 bg-foreground text-background text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {takenByP1 ? "1" : "2"}
                  </span>
                )}

              </button>
            );

          })
          }

        </div>
      </div>



    </div>
  );
}