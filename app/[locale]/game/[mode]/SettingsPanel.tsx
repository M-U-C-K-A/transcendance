"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MapChoice from "@/app/[locale]/game/[mode]/MapChoice";
import ColorChoice from "@/app/[locale]/game/[mode]/ColorChoice";
import { ControlsConfig } from "./ControlsConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChatSection } from "@/components/dashboard/ChatSection";
import { useJWT } from "@/hooks/use-jwt";

interface SettingsPanelProps {
  COLORS: string[];
  currentPlayer: 1 | 2;
  setCurrentPlayer: Dispatch<SetStateAction<1 | 2>>;
  colorP1: string | null;
  setColorP1: Dispatch<SetStateAction<string | null>>;
  colorP2: string | null;
  gamemode: string | null;
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
  gamemode,
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
  const [gameInfo, setGameInfo] = useState<any>(null);
  const jwtToken = useJWT();

  useEffect(() => {
    const fetchGameInfo = async () => {
      if (gamemode === "custom" || gamemode === "tournaments") {
        try {
          const res = await fetch("/api/game/infocreation");
          const data = await res.json();
          setGameInfo(data);
        } catch (err) {
          console.error("Erreur récupération info création :", err);
        }
      }
    };

    fetchGameInfo();
  }, [gamemode]);

  return (
    <div className="flex gap-6 w-full px-4">
      {/* Colonne gauche : joueurs et matchs si custom/tournaments */}
      {(gamemode === "custom" || gamemode === "tournaments") && (
        <div className="w-1/4 space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">En attente</h2>
            <div className="space-y-2">
              {gameInfo ? (
                gameInfo.players?.map((player: any, index: number) => (
                  <Card key={index} className="p-2">👤 {player.name}</Card>
                ))
              ) : (
                <p>Chargement des joueurs...</p>
              )}
            </div>
          </Card>

          {gamemode === "tournaments" && gameInfo?.upcomingMatches && (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-2">Prochains matchs</h2>
              <ul className="list-disc pl-5 space-y-1">
                {gameInfo.upcomingMatches.map((match: any, idx: number) => (
                  <li key={idx}>
                    {match.team1} vs {match.team2} - {match.time}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Centre : configuration */}
      <div className="w-2/4">
        <Card className="p-6 rounded-xl shadow-lg w-full space-y-4">
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

          <Card className="p-4">
            <Label className="block text-center font-semibold mb-3">Vitesse de la balle</Label>
            <div className="flex gap-2 justify-center">
              <Toggle
                pressed={baseSpeed === 16}
                onPressedChange={() => setBaseSpeed(16)}
                className="px-4 py-2 data-[state=on]:bg-green-500 data-[state=on]:text-white"
              >
                🐢 Lent
              </Toggle>
              <Toggle
                pressed={baseSpeed === 24}
                onPressedChange={() => setBaseSpeed(24)}
                className="px-4 py-2 data-[state=on]:bg-yellow-400 data-[state=on]:text-white"
              >
                ⚡ Moyen
              </Toggle>
              <Toggle
                pressed={baseSpeed === 36}
                onPressedChange={() => setBaseSpeed(36)}
                className="px-4 py-2 data-[state=on]:bg-red-500 data-[state=on]:text-white"
              >
                🔥 Rapide
              </Toggle>
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => setIsControlsConfigOpen(true)}
              className="w-full py-6 text-lg"
            >
              Configurer les contrôles
            </Button>

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

          <ControlsConfig
            isOpen={isControlsConfigOpen}
            onClose={() => setIsControlsConfigOpen(false)}
          />
        </Card>
      </div>

      {/* Colonne droite : chat */}
      <div className="w-1/4">
        <div className="border rounded-md h-full">
          <ChatSection currentUser={jwtToken} />
        </div>
      </div>
    </div>
  );
}
