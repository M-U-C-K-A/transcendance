import { useState, useEffect } from "react"
import { useControls } from "./ControlsContext"
import { motion } from "framer-motion"
import { ControlsConfig } from "./ControlsConfig"
import { displayKey } from "./ControlsConfig"
import { MalusSystem } from "./MalusSystem"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n-client"










interface GameUIProps {
  score: { player1: number; player2: number };
  winner: string | null;
  countdown: number | null;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  enableMaluses: boolean;
  MalusBarKey: number;
  stamina: { player1: number; player2: number };
  superPad: { player1: boolean; player2: boolean; player3: boolean; player4: boolean };
  enableSpecial: boolean;
  showGoal: boolean;
  lastScoreType: 'goal' | 'malus';
  malusSystem?: MalusSystem;
  gamemode?: string;
  onMatchEnd?: (winner: string, score: { player1: number; player2: number }) => void;
  enableAI?: boolean;
  is2v2Mode?: boolean;
}






export const GameUI = ({
  score,
  winner,
  countdown,
  isPaused,
  setIsPaused,
  enableMaluses,
  MalusBarKey,
  stamina,
  superPad,
  enableSpecial,
  showGoal,
  lastScoreType,
  malusSystem,
  gamemode,
  onMatchEnd,
  enableAI = false,
  is2v2Mode = false,
}: GameUIProps) =>
{





  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const { controls } = useControls();
    const [wasPausedBeforeControls, setWasPausedBeforeControls] = useState(false);

  // N'utiliser le router que pour les tournois
  const router = gamemode === "tournament" ? useRouter() : null;




  // Pause pdt la config des controls IG
  const openControlsConfig = () => {
    setWasPausedBeforeControls(isPaused);
    setIsPaused(true);
    setIsControlsConfigOpen(true);
  };






  const closeControlsConfig = () => {
    setIsControlsConfigOpen(false);
    if (!wasPausedBeforeControls && countdown === null) {
      setIsPaused(false);
    }
  };







  // Gestion du timer pour le prochain Malus
  const Malus_INTERVAL = 15; // secondes
  const [MalusTimer, setMalusTimer] = useState(Malus_INTERVAL);

  useEffect(() => {
    if (!malusSystem) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setMalusTimer(malusSystem.getRemainingTime());
      }
    }, 100);

    return () => clearInterval(interval);
  }, [MalusBarKey, isPaused, malusSystem]);






  // Timers pour le coup spécial
  const [specialTimer1, setSpecialTimer1] = useState(0);
  const [specialTimer2, setSpecialTimer2] = useState(0);
  const [specialTimer3, setSpecialTimer3] = useState(0);
  const [specialTimer4, setSpecialTimer4] = useState(0);




  // Timer pour le special.
  useEffect(() => {
    let interval1: ReturnType<typeof setInterval> | null = null;
    if (superPad.player1) {
      setSpecialTimer1(5);
      interval1 = setInterval(() => {
        setSpecialTimer1((prev) => {
          if (prev <= 1) {
            clearInterval(interval1!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSpecialTimer1(0);
    }
    return () => {
      if (interval1) clearInterval(interval1);
    };
  }, [superPad.player1]);







  useEffect(() => {
    let interval2: ReturnType<typeof setInterval> | null = null;

    if (superPad.player2) {
      setSpecialTimer2(5);
      interval2 = setInterval(() => {
        setSpecialTimer2((prev) => {
          if (prev <= 1) {
            clearInterval(interval2!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSpecialTimer2(0);
    }

    return () => {
      if (interval2) clearInterval(interval2);
    };
  }, [superPad.player2]);

  // Timer pour le special joueur 3
  useEffect(() => {
    let interval3: ReturnType<typeof setInterval> | null = null;
    if (superPad.player3) {
      setSpecialTimer3(5);
      interval3 = setInterval(() => {
        setSpecialTimer3((prev) => {
          if (prev <= 1) {
            clearInterval(interval3!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSpecialTimer3(0);
    }
    return () => {
      if (interval3) clearInterval(interval3);
    };
  }, [superPad.player3]);

  // Timer pour le special joueur 4
  useEffect(() => {
    let interval4: ReturnType<typeof setInterval> | null = null;
    if (superPad.player4) {
      setSpecialTimer4(5);
      interval4 = setInterval(() => {
        setSpecialTimer4((prev) => {
          if (prev <= 1) {
            clearInterval(interval4!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setSpecialTimer4(0);
    }
    return () => {
      if (interval4) clearInterval(interval4);
    };
  }, [superPad.player4]);







  // Effet pour gérer la fin du match
  useEffect(() => {
    if (winner !== null && onMatchEnd) {
      // Attendre un peu pour que l'utilisateur voie le résultat
      setTimeout(() => {
        onMatchEnd(winner === "player1" ? "player1" : "player2", score);
      }, 2000);
    }
  }, [winner, onMatchEnd, score]);



  const t = useI18n();


  return (
    <>

      {/* Score en haut */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center w-full pointer-events-none">
        <div className="text-3xl font-extrabold text-foreground bg-background/80 px-8 py-2 rounded shadow-lg border border-border mb-2 pointer-events-auto">
      {score.player1} - {score.player2}
      </div>






        {/* Barre de chargement du Malus centrée sous le score */}
        {enableMaluses && (
        <div className="absolute left-1/2 top-28 transform -translate-x-1/2 flex flex-col items-center z-20">
            <span className="mb-1 text-sm font-semibold text-red-700">{t('game.create.malusin')}:</span>
            <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-300 relative">
              <div
                className="h-full bg-red-600 transition-all duration-500"
                style={{ width: `${((Malus_INTERVAL - MalusTimer) / Malus_INTERVAL) * 100}%` }}
              ></div>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white select-none">
                {MalusTimer}s
              </span>
            </div>
          </div>
        )}
        </div>





    {/* CONTROLES GAUCHE (J1 & J3) */}
    <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-4/5 flex flex-col ${is2v2Mode ? 'justify-between' : 'justify-center'} items-center z-20`}>
      
      {/* Touches J1 (Haut) */}
      <div className="flex flex-col items-center">
        {/* Flèches haut/bas */}
        <div className="flex flex-col space-y-2">
          <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
            {displayKey(controls.player1Up)}
          </div>
          <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
            {displayKey(controls.player1Down)}
          </div>
        </div>

        {/* Spécial J1 */}
        {enableSpecial && (
          <>
            <div className="mt-4" />
            {superPad.player1 && (
              <div className="mb-1 text-cyan-700 font-bold text-xs text-center w-16">
                {t('game.create.specialcounter')}: {specialTimer1}s
              </div>
            )}
            <div className={`w-10 h-10 flex items-center justify-center font-bold rounded ${superPad.player1 ? 'bg-cyan-400 border-2 border-cyan-700 text-white animate-pulse' : (stamina.player1 === 5 ? 'bg-yellow-300 border-2 border-yellow-600 text-yellow-800' : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700')}`}>
              {displayKey(controls.player1Special)}
            </div>
            
            {/* Barre de stamina (mode 1v1) */}
            {!is2v2Mode && (
              <>
                <div className="mt-4" />
                <div className="w-10 h-3 bg-gray-200 rounded-full border border-gray-300 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${superPad.player1 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}`}
                    style={{ width: `${(stamina.player1 / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center mt-1 font-semibold">
                  {stamina.player1 < 5 ? (
                    <span className="bg-black text-white px-2 py-0.5 rounded">
                      {5 - stamina.player1} {t('game.create.strikesremaining')}
                    </span>
                  ) : (
                    <span className="text-black">{t('game.create.specialready')}</span>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Barre de stamina (mode 2v2) */}
      {is2v2Mode && enableSpecial && (
        <div className="flex flex-col items-center">
          <div className="w-10 h-3 bg-gray-200 rounded-full border border-gray-300 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${superPad.player1 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}`}
              style={{ width: `${(stamina.player1 / 5) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-center mt-1 font-semibold">
            {stamina.player1 < 5 ? (
              <span className="bg-black text-white px-2 py-0.5 rounded">
                {5 - stamina.player1} {t('game.create.strikesremaining')}
              </span>
            ) : (
              <span className="text-black">{t('game.create.specialready')}</span>
            )}
          </div>
        </div>
      )}

      {/* Touches J3 (Bas) */}
      {is2v2Mode && (
        <div className="flex flex-col items-center">
          <div className="text-xs text-center mb-2 font-bold text-foreground bg-background/80 px-2 py-1 rounded">
            J3
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
              {displayKey(controls.player3Up)}
            </div>
            <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
              {displayKey(controls.player3Down)}
            </div>
          </div>
          {enableSpecial && (
            <>
              <div className="mt-4" />
              {superPad.player3 && (
                <div className="mb-1 text-cyan-700 font-bold text-xs text-center w-16">
                  {t('game.create.specialcounter')}: {specialTimer3}s
                </div>
              )}
              <div className={`w-10 h-10 flex items-center justify-center font-bold rounded ${superPad.player3 ? 'bg-cyan-400 border-2 border-cyan-700 text-white animate-pulse' : (stamina.player1 === 5 ? 'bg-yellow-300 border-2 border-yellow-600 text-yellow-800' : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700')}`}>
                {displayKey(controls.player3Special)}
              </div>
            </>
          )}
        </div>
      )}
    </div>

    {/* CONTROLES DROITE (J2 & J4) */}
    <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 h-4/5 flex flex-col ${is2v2Mode ? 'justify-between' : 'justify-center'} items-center z-20`}>
      
      {/* Touches J2 (Haut) */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col space-y-2">
          <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
            {displayKey(controls.player2Up)}
          </div>
          <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
            {displayKey(controls.player2Down)}
          </div>
        </div>
        {enableSpecial && (
          <>
            {superPad.player2 && (
              <div className="mb-1 text-cyan-700 font-bold text-xs text-center w-16">{t('game.create.specialcounter')}: {specialTimer2}s</div>
            )}
            <div className={`w-10 h-10 mt-2 flex items-center justify-center font-bold rounded ${superPad.player2 ? 'bg-cyan-400 border-2 border-cyan-700 text-white animate-pulse' : (stamina.player2 === 5 ? 'bg-yellow-300 border-2 border-yellow-600 text-yellow-800' : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700')}`}>
              {displayKey(controls.player2Special)}
            </div>
            
            {/* Barre de stamina (mode 1v1) */}
            {!is2v2Mode && (
              <>
                <div className="w-10 h-3 mt-2 bg-gray-200 rounded-full border border-gray-300 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${superPad.player2 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}`}
                    style={{ width: `${(stamina.player2 / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center mt-1 font-semibold">
                  {stamina.player2 < 5 ? (
                    <span className="bg-black text-white px-2 py-0.5 rounded">
                      {5 - stamina.player2} {t('game.create.strikesremaining')}
                    </span>
                  ) : (
                    <span className="text-black">{t('game.create.specialready')}</span>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Barre de stamina (mode 2v2) */}
      {is2v2Mode && enableSpecial && (
        <div className="flex flex-col items-center">
          <div className="w-10 h-3 mt-2 bg-gray-200 rounded-full border border-gray-300 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${superPad.player2 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}`}
              style={{ width: `${(stamina.player2 / 5) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-center mt-1 font-semibold">
            {stamina.player2 < 5 ? (
              <span className="bg-black text-white px-2 py-0.5 rounded">
                {5 - stamina.player2} {t('game.create.strikesremaining')}
              </span>
            ) : (
              <span className="text-black">{t('game.create.specialready')}</span>
            )}
          </div>
        </div>
      )}

      {/* Touches J4 (Bas) */}
      {is2v2Mode && (
        <div className="flex flex-col items-center">
          <div className="text-xs text-center mb-2 font-bold text-foreground bg-background/80 px-2 py-1 rounded">
            J4
          </div>
          <div className="flex flex-col space-y-2">
            <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
              {displayKey(controls.player4Up)}
            </div>
            <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
              {displayKey(controls.player4Down)}
            </div>
          </div>
          {enableSpecial && (
            <>
              <div className="mt-4" />
              {superPad.player4 && (
                <div className="mb-1 text-cyan-700 font-bold text-xs text-center w-16">
                  {t('game.create.specialcounter')}: {specialTimer4}s
                </div>
              )}
              <div className={`w-10 h-10 flex items-center justify-center font-bold rounded ${superPad.player4 ? 'bg-cyan-400 border-2 border-cyan-700 text-white animate-pulse' : (stamina.player2 === 5 ? 'bg-yellow-300 border-2 border-yellow-600 text-yellow-800' : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700')}`}>
                {displayKey(controls.player4Special)}
              </div>
            </>
          )}
        </div>
      )}
    </div>









    {/* sitfness = durete du rebond */}
    {winner && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.5
          }}
          className="bg-background px-8 py-6 rounded-lg shadow-lg flex flex-col items-center"
        >
          <motion.span
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-green-500 text-4xl font-extrabold mb-6"
          >
            🏆 {t('game.create.winner')} {winner} {t('game.create.won')} !
          </motion.span>


          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex space-x-4"
          >


            {/* reload page actuel */}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              {t('game.create.replay')}
            </button>



            {gamemode === "tournament" ? (
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    // Pour les tournois, on retourne à l'écran de sélection des options
                    // Le bracket sera mis à jour automatiquement via onMatchEnd
                    window.location.href = "/game/tournament";
                  }
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                {t('game.create.backoptions')}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.history.back();
                  }
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                {t('game.create.quit')}
              </Button>
            )}

          </motion.div>


        </motion.div>
      </div>
    )}






    {/* Décompte */}
    {countdown !== null && (
      <div className="absolute inset-0 bg-gray-400/40 flex items-center justify-center z-10">
        <span className="text-foreground text-2xl font-bold">
          {countdown}
        </span>
      </div>
    )}








      {/* controles */}
    <div className="absolute top-2 right-2 z-20 flex items-center space-x-2">
        <button
          onClick={openControlsConfig}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          ⚙️
        </button>
      <div className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
        {t('game.create.escape')}
      </div>


     {/* boutton pause qui switch */}

      {isPaused ? (
        <button
          onClick={() => setIsPaused(false)}
            disabled={countdown !== null}
          className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ${
            countdown !== null ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {t('game.create.resume')}
        </button>
      ) : (
        <button
          onClick={() => setIsPaused(true)}
            disabled={countdown !== null}
          className={`bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded ${
            countdown !== null ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {t('game.create.pause')}
        </button>
      )}


    </div>







      {/* Modal de configuration des contrôles */}
      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={closeControlsConfig}
        enableAI={enableAI}
        is2v2Mode={is2v2Mode}
      />





      {/* Animation GOAL/MALUS */}
      {showGoal && (
        lastScoreType === 'malus' ? (
          <div className="fixed top-1/4 left-1/2 z-50 -translate-x-1/2 text-6xl font-extrabold text-red-600 drop-shadow-lg animate-goal-pop select-none pointer-events-none">
            {t('game.create.malus')}!
          </div>
        ) : (
          <div className="fixed top-1/4 left-1/2 z-50 -translate-x-1/2 text-6xl font-extrabold text-green-500 drop-shadow-lg animate-goal-pop select-none pointer-events-none">
            {t('game.create.goal')}!
          </div>
        )
      )}



    </>
  );
};
