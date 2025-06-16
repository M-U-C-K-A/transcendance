"use client";

import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import MapChoice from "@/app/[locale]/game/[mode]/MapChoice";
import ColorChoice from "@/app/[locale]/game/[mode]/ColorChoice";
import { ControlsConfig } from "./ControlsConfig";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useI18n } from "@/i18n-client";
import { Trophy, Gamepad2, Rocket, Turtle, Zap, Flame, Users, ListTree } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
}: SettingsPanelProps) {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const jwtToken = useJWT();
  const t = useI18n();
  const router = useRouter();

  const gameCreationSchema = z.object({
    name: z.string().min(3, t('game.errors.name.min')).max(30, t('game.errors.name.max')),
    type: z.enum(["custom", "tournament"]),
    playerCount: z.number().min(2).max(16).refine(val => val % 2 === 0, {
      message: t('game.errors.playerCount.even'),
    }),
  });

  const form = useForm<GameCreationData>({
    resolver: zodResolver(gameCreationSchema),
    defaultValues: {
      name: "",
      type: gamemode === "tournaments" ? "tournament" : "custom",
      playerCount: 4,
    },
  });

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
      if (!response.ok) throw new Error(t('game.errors.creation'));

      const gameData = await response.json();
      localStorage.setItem("currentGameId", gameData.hashedCode);
      localStorage.setItem("currentGameName", gameData.name);
      setGameInfo({
        ...gameData,
        players: []
      });
    } catch (error) {
      console.error(t('game.errors.creation'), error);
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
      console.error(t('game.errors.fetch'), err);
    }
  };

  const shouldShowCreationDialog = () => {
    if (gamemode !== "custom" && gamemode !== "tournaments") return false;
    if (typeof window !== "undefined")
      if (localStorage.getItem("currentGameId")) return false;
    return !gameInfo;
  };

  const canStart = useMemo(() => {
    return colorP1 !== null && colorP2 !== null && MapStyle !== null;
  }, [gamemode, gameInfo?.players?.length, colorP1, colorP2, MapStyle]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-10xl">
      <Dialog
        open={shouldShowCreationDialog()}
        onOpenChange={(open) => !open && router.push("/")}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {gamemode === "tournaments" ? t('game.tournament.new') : t('game.custom.new')}
            </DialogTitle>
            <DialogDescription>
              {t('game.settings.configure')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(createGame)} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="gameName">{t('game.name')}</Label>
              <Input
                id="gameName"
                placeholder={gamemode === "tournaments" ? t('game.tournament.my') : t('game.custom.my')}
                {...form.register("name")}
                disabled={isLoading}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {gamemode === "tournaments" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>{t('game.playerCount')}</Label>
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
                <span className="animate-pulse">{t('game.creating')}</span>
              ) : (
                gamemode === "tournaments" ? t('game.tournament.create') : t('game.custom.create')
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {(gamemode === "custom" || gamemode === "tournaments") && (
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('game.participants')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gameInfo?.players?.length > 0 ? (
                  gameInfo.players.map((player) => (
                    <Card key={player.id} className="p-3 flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${player.ready ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className="font-medium">{player.name}</span>
                      {player.id === jwtToken?.id && (
                        <Badge variant="secondary" className="ml-auto">
                          {t('game.you')}
                        </Badge>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card className="p-3 text-center text-muted-foreground">
                    {gameInfo ? t('game.waitingPlayers') : t('game.notCreated')}
                  </Card>
                )}
              </CardContent>
            </Card>

            {gamemode === "tournaments" && gameInfo?.upcomingMatches && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListTree className="h-5 w-5" />
                    {t('game.tournament.tree')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gameInfo.upcomingMatches.map((match, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className={`font-medium ${match.status === 'completed' ? 'line-through' : ''}`}>
                          {match.team1}
                        </span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          vs
                        </span>
                        <span className={`font-medium ${match.status === 'completed' ? 'line-through' : ''}`}>
                          {match.team2}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                        <span>{match.time}</span>
                        {match.status === 'ongoing' && (
                          <span className="text-green-500">• {t('game.ongoing')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
<div className={`${gamemode === "custom" || gamemode === "tournaments"
    ? "lg:col-span-6"
    : "lg:col-span-8"
  }`}>
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg">{t('game.settings.title')}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t('game.map.configuration')}</h3>
        <MapChoice
          MapStyle={MapStyle}
          setMapStyle={setMapStyle}
          enableMaluses={enableMaluses}
          setEnableMaluses={setEnableMaluses}
          enableSpecial={enableSpecial}
          setEnableSpecial={setEnableSpecial}
          compact
        />
      </div>

      <Separator className="my-2" />

      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t('game.colors.choice')}</h3>
        <ColorChoice
          COLORS={COLORS}
          currentPlayer={currentPlayer}
          setCurrentPlayer={setCurrentPlayer}
          colorP1={colorP1}
          setColorP1={setColorP1}
          colorP2={colorP2}
          setColorP2={setColorP2}
          compact
        />
      </div>

      <Separator className="my-2" />

      <div className="space-y-3">
        <h3 className="text-sm font-medium">{t('game.ball.speed')}</h3>
        <div className="flex gap-2">
          {[
            { speed: 16, label: t('game.speed.slow'), icon: <Turtle className="h-4 w-4" /> },
            { speed: 24, label: t('game.speed.medium'), icon: <Zap className="h-4 w-4" /> },
            { speed: 36, label: t('game.speed.fast'), icon: <Flame className="h-4 w-4" /> },
          ].map((item) => (
            <Button
              key={item.speed}
              variant={baseSpeed === item.speed ? "default" : "outline"}
              size="sm"
              onClick={() => setBaseSpeed(item.speed)}
              className="flex-1 gap-2"
            >
              {item.icon}
              <span className="sr-only sm:not-sr-only">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex flex-col gap-3 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsControlsConfigOpen(true)}
        className="w-full gap-2"
      >
        <Gamepad2 className="h-4 w-4" />
        {t('game.controls.configure')}
      </Button>

      {!canStart && (
        <Alert variant="destructive" className="w-full py-2">
          <AlertDescription className="text-center text-xs">
            {t('game.requirements')}
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={onStart}
        disabled={!canStart}
        className="w-full gap-2"
        size="sm"
      >
        {gamemode === "tournaments" ? (
          <>
            <Trophy className="h-4 w-4" />
            {t('game.tournament.start')}
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4" />
            {t('game.custom.start')}
          </>
        )}
      </Button>
    </CardFooter>
  </Card>
</div>
        <div className="lg:col-span-3">
          <ChatSection currentUser={jwtToken} />
        </div>
      </div>

      <ControlsConfig
        isOpen={isControlsConfigOpen}
        onClose={() => setIsControlsConfigOpen(false)}
      />
    </div>
  );
}
