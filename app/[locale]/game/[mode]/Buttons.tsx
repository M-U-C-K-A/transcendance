import { Dispatch, SetStateAction, useEffect } from "react";
import Pong3D from "@/components/game/Pong3D";
import { JSX } from "react";
import { BracketMatch } from "@/types/BracketMatch";


// dispatch = recoit une ft et renvoit sont inverse (prev) => !prev

interface ButtonsProps {
  showVolumeSlider: boolean;
  setShowVolumeSlider: (show: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  showTrackMenu: boolean;
  setShowTrackMenu: (show: boolean) => void;
  TRACKS: string[];
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  restartGame: () => void;
  cameraKey: number;
  setCameraKey: (key: number) => void;
  paddle1Color: string;
  paddle2Color: string;
  MapStyle: string;
  enableMaluses: boolean;
  enableSpecial: boolean;
  baseSpeed: number;
  gamemode: string;
  currentMatch: BracketMatch | null;
  updateBracketAfterMatch: (matchId: string, winner: string) => void;
  score: { player1: number; player2: number };
  setScore: (score: { player1: number; player2: number }) => void;
  winner: string | null;
  setWinner: (winner: string | null) => void;
}

export default function Buttons({
  showVolumeSlider,
  setShowVolumeSlider,
  volume,
  setVolume,
  showTrackMenu,
  setShowTrackMenu,
  TRACKS,
  currentTrackIndex,
  setCurrentTrackIndex,
  restartGame,
  cameraKey,
  setCameraKey,
  paddle1Color,
  paddle2Color,
  MapStyle,
  enableMaluses,
  enableSpecial,
  baseSpeed,
  gamemode,
  currentMatch,
  updateBracketAfterMatch,
  score,
  setScore,
  winner,
  setWinner,
}: ButtonsProps): JSX.Element {
  useEffect(() => {
    if (
      gamemode === "tournament" &&
      currentMatch &&
      winner &&
      currentMatch.status !== "completed"
    ) {
      const winnerId = winner === "player1"
        ? currentMatch.player1.id
        : winner === "player2"
          ? currentMatch.player2.id
          : winner;

      updateBracketAfterMatch(currentMatch.id, winnerId);
    }
  }, [winner, currentMatch, gamemode, updateBracketAfterMatch]);

  return (
    <div className="w-[80vw] h-[80vh] relative bg-background rounded-lg border mt-4 flex justify-center items-center mx-auto">




      {/* Contrôles Volume, Musique, Recommencer */}
      <div
        className="absolute top-4 left-2 z-30 flex space-x-2"
        style={{ marginTop: "-12px" }}
      >
        <button
          onClick={() => setShowVolumeSlider((prev) => !prev)}
          className="bg-card border border-border rounded p-1.5 hover:bg-card/80 text-sm"
          aria-label="Volume"
        >
          {volume > 0 ? "🔊" : "🔇"}
        </button>
        {showVolumeSlider && (
          <div className="flex justify-center items-center ml-4 mt-1">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-2 w-20"
            />
          </div>
        )}




        <button
          onClick={() => setShowTrackMenu((prev) => !prev)}
          className="bg-card border border-border rounded p-1.5 hover:bg-card/80 text-sm"
          aria-label="Changer musique"
        >
          💿
        </button>




        <button
          onClick={restartGame}
          className="ml-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          aria-label="Recommencer"
        >
          ↺
        </button>




        {/* Réinitialiser la caméra */}
        <button
          onClick={() => setCameraKey((prev) => prev + 1)}
          className="ml-2 bg-card border border-border rounded p-1.5 hover:bg-card/80 text-sm"
          aria-label="Réinitialiser la caméra"
        >
          🎥
        </button>






      </div>

      {showTrackMenu && (
        <div className="absolute top-12 left-2 z-30 bg-card border border-border rounded shadow-lg p-2 space-y-1">
          {TRACKS.map((track, idx) => (
            <button
              key={track}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setShowTrackMenu(false);
              }}
              className={`block w-full text-left px-2 py-1 rounded ${
                idx === currentTrackIndex ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      )}









      <Pong3D
        resetCamFlag={cameraKey}
        paddle1Color={paddle1Color}
        paddle2Color={paddle2Color}
        MapStyle={MapStyle}
        enableMaluses={enableMaluses}
        enableSpecial={enableSpecial}
        volume={volume}
        baseSpeed={baseSpeed}
        gamemode={gamemode}
        score={score}
        setScore={setScore}
        winner={winner}
        setWinner={setWinner}
      />


    </div>
  );
}
