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
  enableMaluses: boolean;
  setEnableMaluses: Dispatch<SetStateAction<boolean>>;
  enableSpecial: boolean;
  setEnableSpecial: Dispatch<SetStateAction<boolean>>;
  baseSpeed: number;
  setBaseSpeed: Dispatch<SetStateAction<number>>;
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
  enableMaluses,
  setEnableMaluses,
  enableSpecial,
  setEnableSpecial,
  baseSpeed,
  setBaseSpeed,
}: SettingsPanelProps) {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);

  return (
    <div className="bg-card dark:bg-zinc-900 dark:text-white p-10 rounded-xl shadow-lg w-full max-w-2xl mx-auto space-y-10">
      {/* Intègre le composant pour le choix du style du sol */}
      <div className="bg-white dark:bg-zinc-800 dark:text-white rounded-xl shadow-lg p-4">
        <MapChoice
          MapStyle={MapStyle}
          setMapStyle={setMapStyle}
          enableMaluses={enableMaluses}
          setEnableMaluses={setEnableMaluses}
          enableSpecial={enableSpecial}
          setEnableSpecial={setEnableSpecial}
        />
      </div>

      {/* Intègre le composant pour le choix des couleurs des joueurs */}
      <div className="bg-white dark:bg-zinc-800 dark:text-white rounded-xl shadow-lg p-4">
        <ColorChoice
          COLORS={COLORS}
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
          colorP1={colorP1}
          setColorP1={setColorP1}
          colorP2={colorP2}
          setColorP2={setColorP2}
        />
      </div>

      {/* Sélecteur de vitesse de base - version redesign */}
      <div className="bg-white dark:bg-zinc-800 dark:text-white rounded-xl shadow-lg p-4 flex flex-col gap-2 items-center">
        <span className="font-semibold mb-1 text-center">Vitesse de la balle</span>
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg border font-bold transition speed-btn ${baseSpeed === 16 ? 'bg-green-500 text-white border-green-700 shadow-lg' : 'bg-white dark:bg-zinc-700 text-gray-800 dark:text-white border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-600'}`}
            onClick={() => setBaseSpeed(16)}
            aria-label="Lent"
          >🐢 Lent</button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg border font-bold transition speed-btn ${baseSpeed === 24 ? 'bg-yellow-400 text-white border-yellow-600 shadow-lg' : 'bg-white dark:bg-zinc-700 text-gray-800 dark:text-white border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-600'}`}
            onClick={() => setBaseSpeed(24)}
            aria-label="Moyen"
          >⚡ Moyen</button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg border font-bold transition speed-btn ${baseSpeed === 36 ? 'bg-red-500 text-white border-red-700 shadow-lg' : 'bg-white dark:bg-zinc-700 text-gray-800 dark:text-white border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-600'}`}
            onClick={() => setBaseSpeed(36)}
            aria-label="Rapide"
          >🔥 Rapide</button>
        </div>
      </div>

      {/* Boutons de configuration */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setIsControlsConfigOpen(true)}
          className="w-full bg-white dark:bg-zinc-800 dark:text-white text-black font-bold rounded-md border border-gray-200 dark:border-zinc-700 py-3 text-lg shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
        >
          Configurer les contrôles
        </button>
        {/* Message d'erreur si les couleurs ne sont pas choisies */}
        {!canStart && (
          <div className="w-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center py-3 rounded-md">
            <span className="text-red-500 dark:text-red-400 font-medium">
              Veuillez sélectionner une couleur pour chaque joueur avant de commencer
            </span>
          </div>
        )}
        <button
          onClick={onStart}
          disabled={!canStart}
          className={`w-full py-3 text-lg font-bold rounded-md transition shadow-sm
            ${canStart
              ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              : "bg-gray-400 dark:bg-zinc-700 text-white cursor-not-allowed"}
          `}
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
