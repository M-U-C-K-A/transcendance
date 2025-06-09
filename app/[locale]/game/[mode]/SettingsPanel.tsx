import { Dispatch, SetStateAction, useState } from "react";
import MapChoice from "@/app/[locale]/game/[mode]/MapChoice";
import ColorChoice from "@/app/[locale]/game/[mode]/ColorChoice";
import { ControlsConfig } from "./ControlsConfig";
import { Switch } from "@headlessui/react";

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
  enableAcceleration: boolean;
  setEnableAcceleration: Dispatch<SetStateAction<boolean>>;
  speedIncrement: number;
  setSpeedIncrement: Dispatch<SetStateAction<number>>;
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
  enableAcceleration,
  setEnableAcceleration,
  speedIncrement,
  setSpeedIncrement,
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

      {/* Accélération de la balle */}
      <div className="bg-white dark:bg-zinc-800 dark:text-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span>Accélération de la balle</span>
          <Switch
            checked={enableAcceleration}
            onChange={setEnableAcceleration}
            className={`${enableAcceleration ? 'bg-green-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Activer l&apos;accélération</span>
            <span
              className={`${enableAcceleration ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        </div>
        {enableAcceleration && (
          <div className="flex flex-col gap-2">
            <label htmlFor="speedIncrement">Intensité de l&apos;accélération : {(speedIncrement * 100).toFixed(1)}%</label>
            <input
              id="speedIncrement"
              type="range"
              min={0}
              max={0.5}
              step={0.001}
              value={speedIncrement}
              onChange={e => setSpeedIncrement(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
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
