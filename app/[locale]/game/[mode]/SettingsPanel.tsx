"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Schema de validation pour la création de partie
const gameCreationSchema = z.object({
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(30),
  type: z.enum(["custom", "tournament"]),
  playerCount: z.number().min(2).max(8).optional(),
});

type GameCreationData = z.infer<typeof gameCreationSchema>;

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

interface GameInfo {
  id: string;
  name: string;
  players: {
    id: string;
    name: string;
  }[];
  upcomingMatches?: {
    team1: string;
    team2: string;
    time: string;
  }[];
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
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const jwtToken = useJWT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const playerCount = gamemode === "tournaments"
    ? parseInt(searchParams.get("players") || "2")
    : undefined;

  const form = useForm<GameCreationData>({
    resolver: zodResolver(gameCreationSchema),
    defaultValues: {
      name: "",
      type: gamemode === "tournaments" ? "tournament" : "custom",
      playerCount: playerCount,
    },
  });

  // Ouvre le dialogue si c'est une partie custom/tournament et qu'aucune info n'est chargée
  useEffect(() => {
    if ((gamemode === "custom" || gamemode === "tournaments") && !gameInfo) {
      form.reset({
        name: "",
        type: gamemode === "tournaments" ? "tournament" : "custom",
        playerCount: playerCount,
      });
    }
  }, [gamemode, gameInfo]);

  // Crée la partie via l'API
  const createGame = async (data: GameCreationData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/game/typecreation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          name: data.name,
          playerCount: data.type === "tournament" ? data.playerCount : undefined,
          type: data.type,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la création de la partie");

      const gameData = await response.json();
      localStorage.setItem("currentGameId", gameData.id);
      setGameInfo(gameData);
    } catch (error) {
      console.error("Erreur création partie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charge les infos de la partie existante
  const fetchGameInfo = async () => {
    if (gamemode !== "custom" && gamemode !== "tournaments") return;

    try {
      const res = await fetch("/api/game/infocreation");
      const data = await res.json();
      setGameInfo(data);
      if (data?.id) {
        localStorage.setItem("currentGameId", data.id);
      }
    } catch (err) {
      console.error("Erreur récupération info création :", err);
    }
  };

  return (
    <div className="flex gap-6 w-full px-4">
      {/* Dialogue de création de partie */}
      <Dialog open={!gameInfo && (gamemode === "custom" || gamemode === "tournaments")}
              onOpenChange={(open) => !open && router.push("/")}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Créer une {gamemode === "tournaments" ? "tournoi" : "partie custom"}
            </DialogTitle>
            <DialogDescription>
              Donnez un nom à votre {gamemode === "tournaments" ? "tournoi" : "partie"} pour commencer
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(createGame)} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder={`Nom du ${gamemode === "tournaments" ? "tournoi" : "match"}`}
                {...form.register("name")}
                disabled={isLoading}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {gamemode === "tournaments" && (
              <div className="text-sm text-muted-foreground">
                Tournoi avec {playerCount} joueurs
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer la partie"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Colonne gauche : joueurs et matchs */}
      {(gamemode === "custom" || gamemode === "tournaments") && gameInfo && (
        <div className="w-1/4 space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">En attente</h2>
            <div className="space-y-2">
              {gameInfo.players?.length > 0 ? (
                gameInfo.players.map((player, index) => (
                  <Card key={index} className="p-2 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary"></span>
                    <span>{player.name}</span>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">Aucun joueur connecté</p>
              )}
            </div>
          </Card>

          {gamemode === "tournaments" && gameInfo.upcomingMatches && (
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-2">Prochains matchs</h2>
              <ul className="space-y-2">
                {gameInfo.upcomingMatches.map((match, idx) => (
                  <li key={idx} className="text-sm">
                    <div className="font-medium">{match.team1}</div>
                    <div className="text-center">vs</div>
                    <div className="font-medium">{match.team2}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {match.time}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Centre : configuration du jeu */}
      <div className={`${gamemode === "custom" || gamemode === "tournaments" ? "w-2/4" : "w-3/4"}`}>
        <Card className="p-6 rounded-xl shadow-lg w-full space-y-6">
          {/* Configuration de la map */}
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

          {/* Choix des couleurs */}
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

          {/* Vitesse de la balle */}
          <Card className="p-4">
            <Label className="block text-center font-semibold mb-3">
              Vitesse de la balle
            </Label>
            <div className="flex gap-2 justify-center">
              {[16, 24, 36].map((speed) => (
                <Toggle
                  key={speed}
                  pressed={baseSpeed === speed}
                  onPressedChange={() => setBaseSpeed(speed)}
                  className="px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-white"
                  aria-label={`Vitesse ${speed}`}
                >
                  {speed === 16 && "🐢 Lent"}
                  {speed === 24 && "⚡ Moyen"}
                  {speed === 36 && "🔥 Rapide"}
                </Toggle>
              ))}
            </div>
          </Card>

          {/* Boutons d'action */}
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
                  Sélectionnez une couleur et une map pour chaque joueur
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={onStart}
              disabled={!canStart}
              className="w-full py-6 text-lg"
              variant={canStart ? "default" : "secondary"}
            >
              {gamemode === "tournaments" ? "Commencer le tournoi" : "Démarrer la partie"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Colonne droite : chat */}
      <div className="w-1/4">
        <Card className="h-full">
          <ChatSection currentUser={jwtToken} />
        </Card>
      </div>

      {/* Configuration des contrôles */}
      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={() => setIsControlsConfigOpen(false)}
      />
    </div>
  );
}
