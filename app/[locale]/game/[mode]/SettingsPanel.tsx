import { Dispatch, SetStateAction, useState } from "react";
import MapChoice from "@/app/[locale]/game/[mode]/MapChoice";
import ColorChoice from "@/app/[locale]/game/[mode]/ColorChoice";
import { ControlsConfig } from "./ControlsConfig";

interface SettingsPanelProps {
  COLORS: string[];
  currentPlayer: 1 | 2;
  setCurrentPlayer: Dispatch<SetStateAction<1 | 2>>;
  colorP1: string | null;
  setColorP1: Dispatch<SetStateAction<string | null>>;
  colorP2: string | null;
  setColorP2: Dispatch<SetStateAction<string | null>>;
  MapStyle: "classic" | "red" | "neon" | null;
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon" | null>>;
  canStart: boolean;
  onStart: () => void;
}

export default function SettingsPanel({
  COLORS,
  currentPlayer,
  setCurrentPlayer,
  colorP1,
  setColorP1,
  colorP2,
  setColorP2,
  MapStyle,
  setMapStyle,
  canStart,
  onStart,
}: SettingsPanelProps) {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md mx-auto space-y-6">
      {/* Intègre le composant pour le choix du style du sol */}
      <MapChoice MapStyle={MapStyle} setMapStyle={setMapStyle} />

      {/* Intègre le composant pour le choix des couleurs des joueurs */}
      <ColorChoice
        COLORS={COLORS}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        colorP1={colorP1}
        setColorP1={setColorP1}
        colorP2={colorP2}
        setColorP2={setColorP2}
      />

      {/* Boutons de configuration */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => setIsControlsConfigOpen(true)}
          className="px-5 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700"
        >
          Configurer les contrôles
        </button>
        <button
          onClick={onStart}
          disabled={!canStart}
          className={`px-5 py-2 rounded-lg font-bold text-white ${
            canStart
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Démarrer la partie
        </button>
      </div>

      {/* Modal de configuration des contrôles */}
      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={() => setIsControlsConfigOpen(false)}
      />
    </div>
  );
}
