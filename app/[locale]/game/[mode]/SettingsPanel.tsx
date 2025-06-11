import { Dispatch, SetStateAction, useState } from "react";
import MapChoice from "@/app/[locale]/game/[mode]/MapChoice";
import ColorChoice from "@/app/[locale]/game/[mode]/ColorChoice";
import { ControlsConfig } from "./ControlsConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <Card className="p-6 rounded-xl shadow-lg w-full max-w-2xl mx-auto space-y-4">
      {/* Choix du style du sol */}
      <Card className="p-4">
        <MapChoice
          MapStyle={MapStyle}
          setMapStyle={setMapStyle}
          enableMaluses={enableMaluses}
          setEnableMaluses={setEnableMaluses}
          enableSpecial={enableSpecial}
          setEnableSpecial={setEnableSpecial}
        />
      </Card>

      {/* Choix des couleurs des joueurs */}
      <Card className="p-4">
        <ColorChoice
          COLORS={COLORS}
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
          colorP1={colorP1}
          setColorP1={setColorP1}
          colorP2={colorP2}
          setColorP2={setColorP2}
        />
      </Card>

      {/* Sélecteur de vitesse de base */}
      <Card className="p-4">
        <Label className="block text-center font-semibold mb-3">Vitesse de la balle</Label>
        <div className="flex gap-2 justify-center">
          <Toggle
            pressed={baseSpeed === 16}
            onPressedChange={() => setBaseSpeed(16)}
            className="px-4 py-2 data-[state=on]:bg-green-500 data-[state=on]:text-white"
            aria-label="Lent"
          >
            🐢 Lent
          </Toggle>
          <Toggle
            pressed={baseSpeed === 24}
            onPressedChange={() => setBaseSpeed(24)}
            className="px-4 py-2 data-[state=on]:bg-yellow-400 data-[state=on]:text-white"
            aria-label="Moyen"
          >
            ⚡ Moyen
          </Toggle>
          <Toggle
            pressed={baseSpeed === 36}
            onPressedChange={() => setBaseSpeed(36)}
            className="px-4 py-2 data-[state=on]:bg-red-500 data-[state=on]:text-white"
            aria-label="Rapide"
          >
            🔥 Rapide
          </Toggle>
        </div>
      </Card>

      {/* Boutons de configuration */}
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          onClick={() => setIsControlsConfigOpen(true)}
          className="w-full py-6 text-lg"
        >
          Configurer les contrôles
        </Button>

        {/* Message d'erreur si les couleurs ne sont pas choisies */}
        {!canStart && (
          <Alert variant="destructive">
            <AlertDescription className="text-center">
              Veuillez sélectionner une couleur ou une map pour chaque joueur avant de commencer
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={onStart}
          disabled={!canStart}
          className="w-full py-6 text-lg"
          variant={canStart ? "default" : "secondary"}
        >
          Démarrer la partie
        </Button>
      </div>

      {/* Modal de configuration des contrôles */}
      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={() => setIsControlsConfigOpen(false)}
      />
    </Card>
  );
}
