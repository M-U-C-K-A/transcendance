import React, { useState } from "react"
import { GameState } from "../../../../components/game/gameTypes"
import { ControlsConfig } from "./ControlsConfig"
import { useControls } from "./ControlsContext"

export const GameUI: React.FC<{
  score: GameState["score"]
  winner: GameState["winner"]
  countdown: GameState["countdown"]
  isPaused: GameState["isPaused"]
  setIsPaused: (paused: boolean) => void
}> = ({ score, winner, countdown, isPaused, setIsPaused }) => {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const { controls } = useControls();

  return (
    <>
      {/* Score */}
      <div className="flex justify-center mb-4 text-lg font-bold text-foreground">
        {score.player1} - {score.player2}
      </div>

      {/* Touches visuelles */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-20">
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          {controls.player1Up}
        </div>
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          {controls.player1Down}
        </div>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-20">
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          {controls.player2Up}
        </div>
        <div className="w-10 h-10 bg-background border border-gray-300 flex items-center justify-center text-foreground font-bold">
          {controls.player2Down}
        </div>
      </div>

      {/* Gagnant */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-card/50">
          <div className="bg-background px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
            <span className="text-green-500 text-4xl font-extrabold mb-6">
              🏆 {winner} a gagné !
            </span>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Rejouer
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const audio = (window as any).__GAME_AUDIO__;
                    if (audio?.pause) audio.pause();
                  }
                  window.history.back();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Quitter
              </button>
            </div>
          </div>
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

      {/* Contrôles et Pause */}
      <div className="absolute top-2 right-2 z-20 flex items-center space-x-2">
        <button
          onClick={() => setIsControlsConfigOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          ⚙️
        </button>
        <div className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
          Échap
        </div>
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
        onClose={() => setIsControlsConfigOpen(false)}
      />
    </>
  );
};
