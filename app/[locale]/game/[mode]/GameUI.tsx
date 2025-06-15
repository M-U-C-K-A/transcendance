import { useState, useEffect } from "react"
import { useControls } from "./ControlsContext"
import { motion } from "framer-motion"
import { ControlsConfig } from "./ControlsConfig"
import { displayKey } from "./ControlsConfig"
import { MalusSystem } from "./MalusSystem"














interface GameUIProps {
  score: { player1: number; player2: number };
  winner: string | null;
  countdown: number | null;
  isPaused: boolean;
  setIsPaused: (isPaused: boolean) => void;
  enableMaluses: boolean;
  MalusBarKey: number;
  stamina: { player1: number; player2: number };
  superPad: { player1: boolean; player2: boolean };
  enableSpecial: boolean;
  showGoal: boolean;
  lastScoreType: 'goal' | 'malus';
  malusSystem?: MalusSystem;
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
}: GameUIProps) =>
{




  
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const { controls } = useControls();
    const [wasPausedBeforeControls, setWasPausedBeforeControls] = useState(false);
  




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
            <span className="mb-1 text-sm font-semibold text-red-700">Malus dans :</span>
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





    {/* touches visuelles + stamina joueur 1 */}
    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-20">

      {/* Flèches haut/bas */}
      <div className="flex flex-col space-y-2">
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          {displayKey(controls.player1Up)}
        </div>
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          {displayKey(controls.player1Down)}
        </div>
      </div>



      {/* surbrilannce du bouton coupe special et clignotte si active */}
      {enableSpecial && (
        <>
          <div className="mt-4" />
          {superPad.player1 && (
            <div className="mb-1 text-cyan-700 font-bold text-xs text-center w-16">
              Compteur de coup spécial : {specialTimer1}s
            </div>
          )}
          <div className={`w-10 h-10 flex items-center justify-center font-bold rounded ${superPad.player1 ? 'bg-cyan-400 border-2 border-cyan-700 text-white animate-pulse' : (stamina.player1 === 10 ? 'bg-yellow-300 border-2 border-yellow-600 text-yellow-800' : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700')}`}>
            {displayKey(controls.player1Special)}
          </div>
        </>
      )}



      {/* Barre de stamina = par de 10 frappe . baisse (- la stamina stocker actuel en jeu) */}
      {enableSpecial && (
        <>
          <div className="mt-4" />
          <div className="w-10 h-3 bg-gray-200 rounded-full border border-gray-300 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${superPad.player1 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}`}
              style={{ width: `${(stamina.player1 / 10) * 100}%` }}
            ></div>
          </div>
      
          <div className="text-xs text-center mt-1 font-semibold">
            {stamina.player1 < 10 ? (
              <span className="bg-black text-white px-2 py-0.5 rounded">
                {10 - stamina.player1} frappes restantes
              </span>
            ) : (
              <span className="text-black">Coup spécial prêt !</span>
            )}
          </div>
        </>
      )}

    </div>







      {/*touche haut bas joueur 2*/}
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-20">
      
      {/* Flèches haut/bas */}
        <div className="flex flex-col space-y-2">
      <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
        {displayKey(controls.player2Up)}
      </div>
      <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
        {displayKey(controls.player2Down)}
      </div>
        </div>



        {/*surbrilannce du bouton coupe special et clignotte si active*/}
        {enableSpecial && (
          <>
            {superPad.player2 && (
              <div className="mb-1 text-cyan-700 font-bold text-xs text-center w-16">Compteur de coup spécial : {specialTimer2}s</div>
            )}
            <div className={`w-10 h-10 mt-2 flex items-center justify-center font-bold rounded ${superPad.player2 ? 'bg-cyan-400 border-2 border-cyan-700 text-white animate-pulse' : (stamina.player2 === 10 ? 'bg-yellow-300 border-2 border-yellow-600 text-yellow-800' : 'bg-yellow-100 border-2 border-yellow-400 text-yellow-700')}`}>
              {displayKey(controls.player2Special)}
            </div>
          </>
        )}



        {/* barre de stamina joueur 2 */}
        {enableSpecial && (
          <>
            <div className="w-10 h-3 mt-2 bg-gray-200 rounded-full border border-gray-300 relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${superPad.player2 ? 'bg-yellow-400 animate-pulse' : 'bg-cyan-400'}`}
                style={{ width: `${(stamina.player2 / 10) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-center mt-1 font-semibold">
              {stamina.player2 < 10 ? (
                <span className="bg-black text-white px-2 py-0.5 rounded">
                  {10 - stamina.player2} frappes restantes
                </span>
              ) : (
                <span className="text-black">Coup spécial prêt !</span>
              )}
            </div>
          </>
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
            🏆 {winner} a gagné !
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
              Rejouer
            </button>
            
            

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  const audio = window.Game_Audio as { pause?: () => void };
                  if (audio?.pause) 
                    audio.pause();
                }
                window.history.back();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
            >
              Quitter
            </button>

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
        Échap
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
          Reprendre
        </button>
      ) : (
        <button
          onClick={() => setIsPaused(true)}
            disabled={countdown !== null}
          className={`bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded ${
            countdown !== null ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Pause
        </button>
      )}


    </div>







      {/* Modal de configuration des contrôles */}
      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={closeControlsConfig}
      />





      {/* Animation GOAL/MALUS */}
      {showGoal && (
        lastScoreType === 'malus' ? (
          <div className="fixed top-1/4 left-1/2 z-50 -translate-x-1/2 text-6xl font-extrabold text-red-600 drop-shadow-lg animate-goal-pop select-none pointer-events-none">
            MALUS&nbsp;!
          </div>
        ) : (
          <div className="fixed top-1/4 left-1/2 z-50 -translate-x-1/2 text-6xl font-extrabold text-green-500 drop-shadow-lg animate-goal-pop select-none pointer-events-none">
            GOAL&nbsp;!
          </div>
        )
      )}



    </>
  );
};
