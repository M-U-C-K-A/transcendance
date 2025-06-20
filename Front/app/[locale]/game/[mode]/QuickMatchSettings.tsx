"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import MapChoice from "@/app/[locale]/game/[mode]/MapChoice";
import ColorChoice from "@/app/[locale]/game/[mode]/ColorChoice";
import { ControlsConfig } from "./ControlsConfig";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChatSection } from "@/components/dashboard/ChatSection";
import { useI18n } from "@/i18n-client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface QuickMatchSettingsProps {
  COLORS: string[];
  currentPlayer: 1 | 2;
  setCurrentPlayer: Dispatch<SetStateAction<1 | 2>>;
  colorP1: string | null;
  setColorP1: Dispatch<SetStateAction<string | null>>;
  colorP2: string | null;
  setColorP2: Dispatch<SetStateAction<string | null>>;
  MapStyle: "classic" | "red" | "neon";
  setMapStyle: Dispatch<SetStateAction<"classic" | "red" | "neon">>;
  onStart: () => void;
  enableMaluses: boolean;
  setEnableMaluses: Dispatch<SetStateAction<boolean>>;
  enableSpecial: boolean;
  setEnableSpecial: Dispatch<SetStateAction<boolean>>;
  baseSpeed: number;
  setBaseSpeed: Dispatch<SetStateAction<number>>;
  canStart: boolean;
  locale: string;
  enableAI: boolean;
  setEnableAI: Dispatch<SetStateAction<boolean>>;
  gamemode?: string;
  tournamentWinner?: string | null;
  showWinnerDialog?: boolean;
  setShowWinnerDialog?: Dispatch<SetStateAction<boolean>>;
}

export function QuickMatchSettings({
  COLORS,
  currentPlayer,
  setCurrentPlayer,
  colorP1,
  setColorP1,
  colorP2,
  setColorP2,
  MapStyle,
  setMapStyle,
  onStart,
  enableMaluses,
  setEnableMaluses,
  enableSpecial,
  setEnableSpecial,
  baseSpeed,
  setBaseSpeed,
  canStart,
  locale,
  enableAI,
  setEnableAI,
  gamemode = "quickmatch",
  tournamentWinner,
  showWinnerDialog,
  setShowWinnerDialog,
}: QuickMatchSettingsProps) {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const t = useI18n();
  const router = useRouter();

  // Désactive l'IA en mode tournoi et custom
  const isAIDisabled = gamemode === "tournament" || gamemode === "custom";

  return (
    <div className="container mx-auto px-4 py-8 max-w-10xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6 rounded-xl">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">{t('game.map.title')}</h2>
                <MapChoice
                  MapStyle={MapStyle}
                  setMapStyle={setMapStyle}
                  enableMaluses={enableMaluses}
                  setEnableMaluses={setEnableMaluses}
                  enableSpecial={enableSpecial}
                  setEnableSpecial={setEnableSpecial}
                />
              </div>

              <div className="flex items-center justify-center">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🤖</span>
                    <Label htmlFor="ai-switch" className={isAIDisabled ? "opacity-50" : ""}>VS AI</Label>
                    <Switch
                      id="ai-switch"
                      checked={enableAI}
                      onCheckedChange={setEnableAI}
                      disabled={isAIDisabled}
                    />
                  </div>
                  {isAIDisabled && (
                    <div className="text-center mt-2">
                      <span className="text-sm text-muted-foreground">
                        (Non disponible en mode {gamemode})
                      </span>
                    </div>
                  )}
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">{t('game.create.color')}</h2>
                <ColorChoice
                  COLORS={COLORS}
                  currentPlayer={currentPlayer}
                  setCurrentPlayer={setCurrentPlayer}
                  colorP1={colorP1}
                  setColorP1={setColorP1}
                  colorP2={colorP2}
                  setColorP2={setColorP2}
                  enableAI={enableAI}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4 text-center">{t('game.create.speed')}</h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { speed: 16, label: t('game.create.slow'), color: "bg-green-500" },
                    { speed: 24, label: t('game.create.medium'), color: "bg-yellow-400" },
                    { speed: 36, label: t('game.create.fast'), color: "bg-red-500" },
                  ].map((item) => (
                    <Toggle
                      key={item.speed}
                      pressed={baseSpeed === item.speed}
                      onPressedChange={() => setBaseSpeed(item.speed)}
                      className={`px-4 py-2 ${baseSpeed === item.speed ? item.color : ''}`}
                    >
                      {item.label}
                    </Toggle>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setIsControlsConfigOpen(true)}
                  className="w-full py-6 text-lg"
                >
                  {t('game.controls.title')}
                </Button>

                {!canStart && (
                  <Alert variant="destructive">
                    <AlertDescription className="w-full flex justify-center items-center text-center">
                      {t('game.tournament.create.select')}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Bouton de démarrage ou retour au dashboard selon l'état du tournoi */}
                {gamemode === "tournament" && tournamentWinner ? (
                  <Button
                    onClick={() => router.push(`/dashboard`)}
                    className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
                  >
                    🏆 Retour au Dashboard
                  </Button>
                ) : (
                  <Button
                    onClick={onStart}
                    disabled={!canStart}
                    className="w-full py-6 text-lg"
                    variant={canStart ? "default" : "secondary"}
                  >
                    {t('game.tournament.create.start')}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <ChatSection />
        </div>
      </div>

      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={() => setIsControlsConfigOpen(false)}
        enableAI={enableAI}
      />
    </div>
  );
}
