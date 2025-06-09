import { Dispatch, SetStateAction } from "react";
import Pong3D from "@/components/game/Pong3D";

interface GameUIProps {
  showVolumeSlider: boolean;
  setShowVolumeSlider: Dispatch<SetStateAction<boolean>>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  showTrackMenu: boolean;
  setShowTrackMenu: Dispatch<SetStateAction<boolean>>;
  TRACKS: { label: string; src: string }[];
  currentTrackIndex: number;
  setCurrentTrackIndex: Dispatch<SetStateAction<number>>;
  restartGame: () => void;
  cameraKey: number;
  setCameraKey: Dispatch<SetStateAction<number>>;
  paddle1Color: string;
  paddle2Color: string;
  MapStyle: "classic" | "red" | "neon";
  enableMaluses: boolean;
  enableSpecial: boolean;
  enableAcceleration: boolean;
  speedIncrement: number;
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
  enableAcceleration,
  speedIncrement
}: GameUIProps) {
  return (
    <div className="w-[80vw] h-[80vh] relative bg-background rounded-lg border border-border">
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
              key={track.label}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setShowTrackMenu(false);
              }}
              className={`block w-full text-left px-2 py-1 rounded ${
                idx === currentTrackIndex ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      )}

      {/* Le composant Pong3D reçoit maintenant resetCamFlag au lieu de key */}
      <Pong3D
        resetCamFlag={cameraKey}
        paddle1Color={paddle1Color}
        paddle2Color={paddle2Color}
        MapStyle={MapStyle}
        enableMaluses={enableMaluses}
        enableSpecial={enableSpecial}
        volume={volume}
        enableAcceleration={enableAcceleration}
        speedIncrement={speedIncrement}
      />
    </div>
  );
}
