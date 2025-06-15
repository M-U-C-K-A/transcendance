"use client";

import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";
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
import { Slider } from "@/components/ui/slider";


// Pour customi
const gameCreationSchema = z.object({
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(30),
  type: z.enum(["custom", "tournament"]),
  playerCount: z.number().min(2).max(16).refine(val => val % 2 === 0, {
    message: "Le nombre de joueurs doit être un multiple de 2",
  }),
});




type GameCreationData = z.infer<typeof gameCreationSchema>;




interface Player {
  id: string;
  name: string;
  ready?: boolean;
}



interface Match {
  team1: string;
  team2: string;
  time: string;
  status?: "pending" | "ongoing" | "completed";
}




interface GameInfo {
  id: string;
  name: string;
  players: Player[];
  upcomingMatches?: Match[];
  status?: "waiting" | "starting" | "ongoing";
}





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
  onStart,
  enableMaluses,
  setEnableMaluses,
  enableSpecial,
  setEnableSpecial,
  baseSpeed,
  setBaseSpeed,
}: SettingsPanelProps) 
{



  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const jwtToken = useJWT();
  const router = useRouter();





  const form = useForm<GameCreationData>({
    resolver: zodResolver(gameCreationSchema),
    defaultValues: {
      name: "",
      type: gamemode === "tournaments" ? "tournament" : "custom",
      playerCount: 4,
    },
  });





  // Initialize game info from localStorage
  useEffect(() => {
    const storedGameId = localStorage.getItem("currentGameId");
    const storedGameName = localStorage.getItem("currentGameName");

    if (storedGameId && storedGameName && !gameInfo) {
      setGameInfo({
        id: storedGameId,
        name: storedGameName,
        players: [],
        status: "waiting"
      });
    }
  }, []);






  // Reset form when gamemode changes
  useEffect(() => {
    if (gamemode === "custom" || gamemode === "tournaments") {
      form.reset({
        name: "",
        type: gamemode === "tournaments" ? "tournament" : "custom",
        playerCount: 4,
      });
    }
  }, [gamemode]);










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
        }),
      });
      if (!response.ok) throw new Error("Erreur lors de la création");

      const gameData = await response.json();
      localStorage.setItem("currentGameId", gameData.hashedCode);
      localStorage.setItem("currentGameName", gameData.name);
      setGameInfo({
        ...gameData,
        players: []
      });
    } catch (error) {
      console.error("Erreur création partie:", error);
    } finally {
      setIsLoading(false);
    }
  };







  const fetchGameInfo = async () => {
    if (gamemode !== "custom" && gamemode !== "tournaments") return;

    try {
      const res = await fetch("/api/game/infocreation");
      const data = await res.json();
      setGameInfo(data);
      if (data?.id) {
        localStorage.setItem("currentGameId", data.id);
        localStorage.setItem("currentGameName", data.name);
      }
    } catch (err) {
      console.error("Erreur récupération info:", err);
    }
  };




  const shouldShowCreationDialog = () => {
    if (gamemode !== "custom" && gamemode !== "tournaments") return false;
    if (localStorage.getItem("currentGameId")) return false;
    return !gameInfo;
  };




  const canStart = useMemo(() => {
    return colorP1 !== null && colorP2 !== null && MapStyle !== null;
  }, [gamemode, gameInfo?.players?.length, colorP1, colorP2, MapStyle]);

































  return (


    <div className="container mx-auto px-4 py-8 max-w-10xl">
      {/* Dialogue de création */}
      <Dialog
        open={shouldShowCreationDialog()}
        onOpenChange={(open) => !open && router.push("/")}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {gamemode === "tournaments" ? "Nouveau Tournoi" : "Partie Custom"}
            </DialogTitle>
            <DialogDescription>
              Configurez les paramètres de base
            </DialogDescription>
          </DialogHeader>







          <form onSubmit={form.handleSubmit(createGame)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="gameName">Nom</Label>
              <Input
                id="gameName"
                placeholder={`Mon ${gamemode === "tournaments" ? "Tournoi" : "Match"}`}
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Nombre de joueurs</Label>
                  <span className="font-bold text-lg">
                    {form.watch("playerCount")}
                  </span>
                </div>
                <Slider
                  defaultValue={[4]}
                  min={2}
                  max={16}
                  step={2}
                  onValueChange={(value) => form.setValue("playerCount", value[0])}
                  value={[form.watch("playerCount")]}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground px-2">
                  {[2, 4, 6, 8, 10, 12, 14, 16].map(num => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Création en cours...</span>
              ) : (
                `Créer ${gamemode === "tournaments" ? "le Tournoi" : "la Partie"}`
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>






      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne gauche - Toujours visible pour les modes custom/tournaments */}
        {(gamemode === "custom" || gamemode === "tournaments") && (
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <div className="space-y-3">
                {gameInfo?.players?.length > 0 ? (
                  gameInfo.players.map((player) => (
                    <Card key={player.id} className="p-3 flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        player.ready ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="font-medium">{player.name}</span>
                      {player.id === jwtToken?.id && (
                        <span className="ml-auto text-xs bg-primary/10 px-2 py-1 rounded">
                          Vous
                        </span>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card className="p-3 text-center text-muted-foreground">
                    {gameInfo ? "En attente de joueurs..." : "Partie non créée"}
                  </Card>
                )}
              </div>
            </Card>






            {gamemode === "tournaments" && gameInfo?.upcomingMatches && (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">Arbre du Tournoi</h2>
                <div className="space-y-4">
                  {gameInfo.upcomingMatches.map((match, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${
                          match.status === 'completed' ? 'line-through' : ''
                        }`}>
                          {match.team1}
                        </span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          vs
                        </span>
                        <span className={`font-medium ${
                          match.status === 'completed' ? 'line-through' : ''
                        }`}>
                          {match.team2}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                        <span>{match.time}</span>
                        {match.status === 'ongoing' && (
                          <span className="text-green-500">• En cours</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}








        {/* Colonne centrale */}
        <div className={`${
          gamemode === "custom" || gamemode === "tournaments"
            ? "lg:col-span-6"
            : "lg:col-span-8"
        }`}>






          
          <Card className="p-6 rounded-xl">
            <div className="space-y-6">
              {/* Configuration Map */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Configuration de la Map</h2>
                <MapChoice
                  MapStyle={MapStyle}
                  setMapStyle={setMapStyle}
                  enableMaluses={enableMaluses}
                  setEnableMaluses={setEnableMaluses}
                  enableSpecial={enableSpecial}
                  setEnableSpecial={setEnableSpecial}
                />
              </div>




              {/*  couleurs */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Choix des Couleurs</h2>
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




              {/* vitesse balle */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Vitesse de la balle</h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { speed: 16, label: "🐢 Lent", color: "bg-green-500" },
                    { speed: 24, label: "⚡ Moyen", color: "bg-yellow-400" },
                    { speed: 36, label: "🔥 Rapide", color: "bg-red-500" },
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






              {/* Boutons Actions */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setIsControlsConfigOpen(true)}
                  className="w-full py-6 text-lg"
                >
                  🎮 Configurer les contrôles
                </Button>




                {!canStart && (
                  <Alert variant="destructive">
                    <AlertDescription className="w-full text-center">
                      Sélectionnez une couleur et une map pour commencer
                    </AlertDescription>
                  </Alert>
                )}




                <Button
                  onClick={onStart}
                  disabled={!canStart}
                  className="w-full py-6 text-lg"
                  variant={canStart ? "default" : "secondary"}
                >
                  {gamemode === "tournaments"
                    ? "🏆 Démarrer le Tournoi"
                    : "🚀 Lancer la Partie"}
                </Button>



              </div>
            </div>
          </Card>
        </div>





        {/* Colonne droite - Chat */}
        <div className="lg:col-span-3">
          <ChatSection currentUser={jwtToken} />
        </div>
      </div>




      {/* Config Contrôles */}
      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={() => setIsControlsConfigOpen(false)}
      />
    </div>
  );
}
