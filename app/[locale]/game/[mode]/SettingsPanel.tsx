import { Dispatch, SetStateAction, useState } from "react";
import MapChoice from "@/app/[locale]/game/[mode]/MapChoice";
import ColorChoice from "@/app/[locale]/game/[mode]/ColorChoice";
import { ControlsConfig } from "./ControlsConfig";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
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
}: SettingsPanelProps) {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">Paramètres de la partie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Intègre le composant pour le choix du style de map */}
        <MapChoice 
          MapStyle={MapStyle} 
          setMapStyle={setMapStyle}
          enableMaluses={enableMaluses}
          setEnableMaluses={setEnableMaluses}
          enableSpecial={enableSpecial}
          setEnableSpecial={setEnableSpecial}
        />

        {/* Intègre le composant pour le choix des couleurs */}
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
        <div className="flex flex-col space-y-4">
          <Button
            onClick={() => setIsControlsConfigOpen(true)}
            variant="secondary"
            className="w-full"
          >
            Configurer les contrôles
          </Button>

          {!canStart && (
            <Alert variant="destructive">
              <AlertDescription>
                Veuillez sélectionner une couleur pour chaque joueur avant de commencer
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={onStart}
            disabled={!canStart}
            className="w-full"
            size="lg"
          >
            Démarrer la partie
          </Button>
        </div>

        {/* Modal de configuration des contrôles */}
        <Dialog 
          open={isControlsConfigOpen} 
          onOpenChange={setIsControlsConfigOpen}
        >
          <ControlsConfig
            isOpen={isControlsConfigOpen}
            onClose={() => setIsControlsConfigOpen(false)}
          />
        </Dialog>
      </CardContent>
    </Card>
  );
}
