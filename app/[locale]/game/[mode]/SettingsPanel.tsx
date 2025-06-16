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
import { BracketMatch } from "@/types/BracketMatch";

const gameCreationSchema = z.object({
  name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(30),
  type: z.enum(["custom", "tournament"]),
  playerCount: z.number().min(2).max(8).refine(val => val % 2 === 0, {
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
  setColorP2: Dispatch<SetStateAction<string | null>>;
  gamemode: string;
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
  bracket: BracketMatch[];
  setBracket: Dispatch<SetStateAction<BracketMatch[]>>;
  currentMatch: BracketMatch | null;
  setCurrentMatch: Dispatch<SetStateAction<BracketMatch | null>>;
  currentMatchIndex: number;
  setCurrentMatchIndex: Dispatch<SetStateAction<number>>;
  tournamentStarted: boolean;
  setTournamentStarted: Dispatch<SetStateAction<boolean>>;
  updateBracketAfterMatch: (matchId: string, winner: string) => void;
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
  canStart,
  bracket,
  setBracket,
  currentMatch,
  setCurrentMatch,
  currentMatchIndex,
  setCurrentMatchIndex,
  tournamentStarted,
  setTournamentStarted,
  updateBracketAfterMatch,
}: SettingsPanelProps) {
  const [isControlsConfigOpen, setIsControlsConfigOpen] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const jwtToken = useJWT();
  const router = useRouter();
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);

  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [participants, setParticipants] = useState<Array<{
    id: string;
    username: string;
    elo: number;
    win: number;
    lose: number;
  }>>([]);

  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);

  const form = useForm<GameCreationData>({
    resolver: zodResolver(gameCreationSchema),
    defaultValues: {
      name: "",
      type: gamemode === "tournament" ? "tournament" : "custom",
      playerCount: 4,
    },
  });

  const sendTournamentResult = async (winner: string) => {
    try {
      const token = localStorage.getItem("token");
      const tournamentId = localStorage.getItem("tournamentId");

      if (!token || !tournamentId) {
        console.error("Token ou ID du tournoi manquant");
        return;
      }

      const response = await fetch("/api/tournament/result/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: winner,
          tournamentId: tournamentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du résultat du tournoi");
      }

      setTournamentWinner(winner);
      setShowWinnerDialog(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

    } catch (error) {
      console.error("Erreur lors de l'envoi du résultat:", error);
    }
  };

  // Fonction pour gérer la fin d'un match
  const handleMatchEnd = (winner: string) => {
    if (gamemode === "tournament" && currentMatch) {
      console.log("Fin du match détectée");
      console.log("Match:", currentMatch);
      console.log("Gagnant:", winner);

      setCurrentWinner(winner);
      setMatchCompleted(true);

      // Mettre à jour le statut du match dans le bracket
      setBracket(prevBracket => {
        const newBracket = [...prevBracket];
        const match = newBracket.find(m => m.id === currentMatch.id);
        if (match) {
          match.status = "completed";
          match.winner = winner;

          // Trouver le match du prochain tour
          const nextRound = match.round + 1;
          const nextMatchNumber = Math.ceil(match.matchNumber / 2);
          const nextMatch = newBracket.find(m =>
            m.round === nextRound &&
            m.matchNumber === nextMatchNumber
          );

          if (nextMatch) {
            // Trouver le gagnant dans le match actuel
            const winnerPlayer = match.player1?.username === winner
              ? match.player1
              : match.player2;

            if (winnerPlayer) {
              // Déterminer si c'est le premier ou le deuxième joueur du prochain match
              const isFirstPlayer = match.matchNumber % 2 === 1;

              // Mettre à jour le prochain match avec le gagnant
              if (isFirstPlayer) {
                nextMatch.player1 = winnerPlayer;
              } else {
                nextMatch.player2 = winnerPlayer;
              }

              console.log("Prochain match mis à jour avec le gagnant:", nextMatch);
            }
          }

          // Vérifier si c'est le dernier match et s'il est terminé
          const lastMatch = newBracket[newBracket.length - 1];
          if (lastMatch && lastMatch.status === "completed" && lastMatch.winner) {
            console.log("Tournoi terminé, envoi du résultat");
            sendTournamentResult(lastMatch.winner);
          }

          console.log("Bracket mis à jour avec le gagnant:", newBracket);
          localStorage.setItem("tournamentBracket", JSON.stringify(newBracket));
        }
        return newBracket;
      });
    }
  };

  // Synchronisation du bracket avec le localStorage - uniquement pour le mode tournoi
  useEffect(() => {
    if (gamemode === "tournament") {
      const storedBracket = localStorage.getItem("tournamentBracket");
      console.log("Chargement du bracket depuis localStorage:", storedBracket);

      if (storedBracket) {
        const parsedBracket = JSON.parse(storedBracket);
        console.log("Bracket parsé:", parsedBracket);

        // Réinitialiser les matchs en cours qui n'ont pas de gagnant
        parsedBracket.forEach((match: BracketMatch) => {
          if (match.status === "ongoing" && !match.winner) {
            match.status = "pending";
          }
        });

        // Vérifier si des matchs sont terminés mais que les gagnants ne sont pas placés
        parsedBracket.forEach((match: BracketMatch) => {
          if (match.status === "completed" && match.winner) {
            const nextRound = match.round + 1;
            const nextMatchNumber = Math.ceil(match.matchNumber / 2);
            const nextMatch = parsedBracket.find(m =>
              m.round === nextRound &&
              m.matchNumber === nextMatchNumber
            );

            if (nextMatch) {
              const winnerPlayer = match.player1?.username === match.winner
                ? match.player1
                : match.player2;

              if (winnerPlayer) {
                const isFirstPlayer = match.matchNumber % 2 === 1;
                if (isFirstPlayer) {
                  nextMatch.player1 = winnerPlayer;
                } else {
                  nextMatch.player2 = winnerPlayer;
                }
              }
            }
          }
        });

        setBracket(parsedBracket);

        // Vérifier si le tournoi est terminé
        const lastMatch = parsedBracket[parsedBracket.length - 1];
        if (lastMatch && lastMatch.status === "completed" && lastMatch.winner) {
          console.log("Tournoi terminé lors du chargement, envoi du résultat");
          sendTournamentResult(lastMatch.winner);
        } else {
          // Trouver le premier match en attente avec deux joueurs
          const nextMatch = parsedBracket.find((match: BracketMatch) =>
            match.status === "pending" &&
            match.player1 !== null &&
            match.player2 !== null
          );

          if (nextMatch) {
            const nextMatchIndex = parsedBracket.findIndex((m: BracketMatch) => m.id === nextMatch.id);
            setCurrentMatch(nextMatch);
            setCurrentMatchIndex(nextMatchIndex);
          }
        }
      }
    }
  }, [gamemode, setBracket]);

  // Mise à jour du localStorage quand le bracket change - uniquement pour le mode tournoi
  useEffect(() => {
    if (gamemode === "tournament" && bracket.length > 0) {
      console.log("Mise à jour du localStorage avec le nouveau bracket:", bracket);
      localStorage.setItem("tournamentBracket", JSON.stringify(bracket));
    }
  }, [bracket, gamemode]);

  // Initialize game info from localStorage
  useEffect(() => {
    if (gamemode === "tournament") {
      const tournamentId = localStorage.getItem("tournamentId");
      const tournamentName = localStorage.getItem("currentGameName");

      if (tournamentId && tournamentName && !gameInfo) {
      setGameInfo({
          id: tournamentId,
          name: tournamentName,
        players: [],
        status: "waiting"
      });
    }
    }
  }, [gamemode]);

  // Reset form when gamemode changes
  useEffect(() => {
    if (gamemode === "custom" || gamemode === "tournament") {
      form.reset({
        name: "",
        type: gamemode === "tournament" ? "tournament" : "custom",
        playerCount: 4,
      });
    }
  }, [gamemode]);

  const createGame = async (data: GameCreationData) => {
    console.log("Création du tournoi avec les données:", data);
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const response = await fetch("/api/tournament/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          slot: data.playerCount,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la création du tournoi");

      const tournamentData = await response.json();
      console.log("Réponse du serveur:", tournamentData);

      // Stocker les informations du tournoi
      localStorage.setItem("tournamentId", tournamentData.tournamentId);
      localStorage.setItem("tournamentSlot", tournamentData.tournamentSlot);

      // Ajouter le host comme premier participant et le stocker dans le localStorage
      const hostParticipant = {
        id: tournamentData.hostId,
        username: tournamentData.username,
        elo: tournamentData.elo,
        win: tournamentData.win,
        lose: tournamentData.lose
      };
      localStorage.setItem("tournamentParticipants", JSON.stringify([hostParticipant]));
      setParticipants([hostParticipant]);

      // Afficher la popup de join
      setShowJoinDialog(true);
    } catch (error) {
      console.error("Erreur création partie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGameInfo = async () => {
    if (gamemode !== "custom" && gamemode !== "tournament") return;

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
    if (gamemode !== "tournament") return false;
    if (typeof window === 'undefined') return false;
    const tournamentId = localStorage.getItem("tournamentId");
    return !tournamentId;
  };

  // Ajoutons la fonction pour rejoindre le tournoi
  const joinTournament = async (username: string) => {
    try {
      const token = localStorage.getItem("token");
      const tournamentId = localStorage.getItem("tournamentId");

      const response = await fetch("/api/tournament/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tournamentId,
          username,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la jointure du tournoi");

      const userData = await response.json();
      console.log("Nouveau participant reçu:", userData);

      // Mettre à jour les participants
      setParticipants(prev => {
        const newParticipants = [...prev, userData];
        localStorage.setItem("tournamentParticipants", JSON.stringify(newParticipants));

        // Vérifier si le tournoi est plein
        const tournamentSlot = localStorage.getItem("tournamentSlot");
        if (newParticipants.length >= Number(tournamentSlot)) {
          // Créer le bracket localement
          const matches = createBracket(newParticipants);
          setBracket(matches);
          setCurrentMatch(matches[0]);
          setCurrentMatchIndex(0);
          setShowJoinDialog(false);
        }

        return newParticipants;
      });
    } catch (error) {
      console.error("Erreur jointure tournoi:", error);
    }
  };

  // Fonction pour créer le bracket
  const createBracket = (playersParam?: typeof participants) => {
    // Toujours relire la liste du localStorage pour être sûr d'avoir tout le monde
    const players = playersParam || JSON.parse(localStorage.getItem("tournamentParticipants") || "[]");
    console.log("Création du bracket avec les joueurs:", players);

    // S'assurer que nous avons tous les joueurs
    if (players.length !== Number(localStorage.getItem("tournamentSlot"))) {
      console.error("Nombre de joueurs incorrect:", players.length);
      return [];
    }

    // Mélanger les joueurs aléatoirement
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const matches: BracketMatch[] = [];
    const totalRounds = Math.ceil(Math.log2(players.length));

    // Créer les matchs du premier tour
    for (let i = 0; i < players.length; i += 2) {
      if (i + 1 < players.length) {
        matches.push({
          id: `match-${matches.length + 1}`,
          round: 1,
          matchNumber: matches.length + 1,
          player1: shuffledPlayers[i],
          player2: shuffledPlayers[i + 1],
          status: "pending"
        });
      }
    }

    // Créer les matchs des tours suivants
    let currentRoundMatches = matches.length;
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.ceil(currentRoundMatches / 2);
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          id: `match-${matches.length + 1}`,
          round,
          matchNumber: i + 1,
          player1: null,
          player2: null,
          status: "pending"
        });
      }
      currentRoundMatches = matchesInRound;
    }

    console.log("Bracket créé:", matches);
    return matches;
  };

  // Fonction pour démarrer le tournoi - uniquement pour le mode tournoi
  const startTournament = async () => {
    if (gamemode !== "tournament") return;

      const token = localStorage.getItem("token");
      const tournamentId = localStorage.getItem("tournamentId");

      // Créer le bracket avec tous les participants
      const matches = createBracket(participants);
      console.log("Bracket créé:", matches);

      if (matches.length === 0) {
        console.error("Erreur lors de la création du bracket");
        return;
      }

      // Initialiser le bracket et le premier match
      setBracket(matches);
      setCurrentMatch(matches[0]);
      setCurrentMatchIndex(0);
      setTournamentStarted(true);
      localStorage.setItem("tournamentBracket", JSON.stringify(matches));

  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-10xl">
      {/* Popup de création de tournoi - Vérification plus stricte */}
      {gamemode === "tournament" && (
      <Dialog
        open={shouldShowCreationDialog()}
          onOpenChange={(open) => {
            if (!open && typeof window !== 'undefined' && !localStorage.getItem("tournamentId")) {
              router.push("/");
            }
          }}
        >
          <DialogContent>
          <DialogHeader>
              <DialogTitle>Créer un Tournoi</DialogTitle>
            <DialogDescription>
                Configurez les paramètres de votre tournoi
            </DialogDescription>
          </DialogHeader>

            <form
              onSubmit={form.handleSubmit((data) => {
                console.log("Formulaire soumis avec les données:", data);
                createGame(data);
              })}
              className="space-y-6"
            >
            <div className="space-y-3">
                <Label htmlFor="gameName">Nom du tournoi</Label>
              <Input
                id="gameName"
                  placeholder="Mon Tournoi"
                {...form.register("name")}
                disabled={isLoading}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Nombre de participants</Label>
                  <span className="font-bold text-lg">
                    {form.watch("playerCount")}
                  </span>
                </div>
                <Slider
                  defaultValue={[4]}
                  min={2}
                  max={8}
                  step={2}
                  onValueChange={(value) => form.setValue("playerCount", value[0])}
                  value={[form.watch("playerCount")]}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground px-2">
                  {[2, 4, 6, 8].map(num => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Création en cours...</span>
              ) : (
                  "Créer le Tournoi"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      )}

      {/* Popup de join */}
      {gamemode === "tournament" && showJoinDialog && (
        <Dialog
          open={participants.length < Number(localStorage.getItem("tournamentSlot"))}
          onOpenChange={(open) => {
            if (!open && participants.length < Number(localStorage.getItem("tournamentSlot"))) {
              return;
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejoindre le Tournoi</DialogTitle>
              <DialogDescription>
                Entrez votre nom d'utilisateur pour participer
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={(e) => {
              e.preventDefault();
              const username = e.currentTarget.username.value;
              joinTournament(username);
              e.currentTarget.reset();
            }} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Votre nom"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Rejoindre
              </Button>
            </form>

            {/* Liste des participants - Mise à jour pour afficher tous les participants */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Participants ({participants.length}/{localStorage.getItem("tournamentSlot")})
              </h3>
              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 bg-secondary/20 rounded">
                    <span className="text-sm font-medium text-muted-foreground">
                      Joueur {index + 1}:
                    </span>
                    <img
                      src={`/profilepicture/${participant.id}.webp`}
                      alt={participant.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{participant.username}</span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {participant.win}W/{participant.lose}L
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de victoire */}
      <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-500">
              🏆 Tournoi Terminé ! 🏆
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <h3 className="text-xl font-semibold mb-2">Vainqueur du Tournoi</h3>
            <p className="text-3xl font-bold text-primary">{tournamentWinner}</p>
            <p className="text-sm text-muted-foreground mt-4">
              Redirection vers le dashboard...
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {(gamemode === "custom" || gamemode === "tournament") && (
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

            {gamemode === "tournament" && gameInfo?.upcomingMatches && (
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

        <div className={`${
          gamemode === "custom" || gamemode === "tournament"
            ? "lg:col-span-6"
            : "lg:col-span-8"
        }`}>
          <Card className="p-6 rounded-xl">
            <div className="space-y-6">
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
                    <AlertDescription className="w-full flex justify-center items-center text-center">
                      Sélectionnez une couleur et une map pour commencer
                    </AlertDescription>
                    </Alert>
                )}

                {gamemode === "tournament" ? (
                  <Button
                    onClick={() => {
                      if (currentMatch && !matchCompleted) {
                        console.log("Lancement du match:", currentMatch);
                        // Marquer le match comme en cours seulement s'il n'a pas déjà un gagnant
                        setBracket(prevBracket => {
                          const newBracket = [...prevBracket];
                          const match = newBracket.find(m => m.id === currentMatch.id);
                          if (match && !match.winner) {
                            match.status = "ongoing";
                            localStorage.setItem("tournamentBracket", JSON.stringify(newBracket));
                          }
                          return newBracket;
                        });
                        onStart();
                        // Simuler la fin du match (à remplacer par la vraie logique de fin de match)
                        setTimeout(() => {
                          // Simuler un gagnant aléatoire pour le test
                          const winner = Math.random() > 0.5 ? currentMatch.player1?.username : currentMatch.player2?.username;
                          if (winner) {
                            handleMatchEnd(winner);
                          }
                        }, 5000); // 5 secondes pour l'exemple, à ajuster
                      }
                    }}
                    disabled={!canStart || matchCompleted || currentMatch?.status === "completed"}
                    className="w-full py-6 text-lg"
                    variant={canStart && !matchCompleted && currentMatch?.status !== "completed" ? "default" : "secondary"}
                  >
                    {currentMatch?.status === "completed" ? "Match Terminé" : "🏆 Lancer le Match"}
                  </Button>
                ) : (
                <Button
                  onClick={onStart}
                  disabled={!canStart}
                  className="w-full py-6 text-lg"
                  variant={canStart ? "default" : "secondary"}
                >
                    🚀 Lancer la Partie
                </Button>
                )}
              </div>
            </div>
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

      {/* Affichage du match en cours - uniquement pour les tournois */}
      {gamemode === "tournament" && currentMatch && (
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Match {currentMatch.round}.{currentMatch.matchNumber}
            {currentMatch.status === "completed" && " (Terminé)"}
            {currentMatch.status === "ongoing" && " (En cours)"}
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Joueur 1:</span>
              {currentMatch.player1 ? (
                <>
                  <img
                    src={`/profilepicture/${currentMatch.player1.id}.webp`}
                    alt={currentMatch.player1.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{currentMatch.player1.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentMatch.player1.win}W/{currentMatch.player1.lose}L
                    </p>
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground">En attente</span>
              )}
            </div>

            <span className="text-2xl font-bold">VS</span>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Joueur 2:</span>
              {currentMatch.player2 ? (
                <>
                  <img
                    src={`/profilepicture/${currentMatch.player2.id}.webp`}
                    alt={currentMatch.player2.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{currentMatch.player2.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentMatch.player2.win}W/{currentMatch.player2.lose}L
                    </p>
                  </div>
                </>
              ) : (
                <span className="text-muted-foreground">En attente</span>
              )}
            </div>
          </div>
          {currentMatch.winner && (
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-green-500">
                Vainqueur: {currentMatch.winner}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Affichage du bracket - uniquement pour les tournois */}
      {gamemode === "tournament" && bracket.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Bracket du Tournoi</h2>
          <div className="flex gap-8 overflow-x-auto pb-4">
            {Array.from(new Set(bracket.map(m => m.round))).map(round => (
              <div key={round} className="flex flex-col gap-4 min-w-[200px]">
                <h3 className="text-lg font-semibold mb-2">Tour {round}</h3>
                {bracket
                  .filter(match => match.round === round)
                  .map(match => (
                    <Card
                      key={match.id}
                      className={`p-4 ${
                        match.id === currentMatch?.id ? 'border-primary' : ''
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Joueur 1:</span>
                          {match.player1 ? (
                            <>
                              <img
                                src={`/profilepicture/${match.player1.id}.webp`}
                                alt={match.player1.username}
                                className="w-6 h-6 rounded-full"
                              />
                              <span>{match.player1.username}</span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                {match.player1.win}W/{match.player1.lose}L
                              </span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">En attente</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Joueur 2:</span>
                          {match.player2 ? (
                            <>
                              <img
                                src={`/profilepicture/${match.player2.id}.webp`}
                                alt={match.player2.username}
                                className="w-6 h-6 rounded-full"
                              />
                              <span>{match.player2.username}</span>
                              <span className="ml-auto text-xs text-muted-foreground">
                                {match.player2.win}W/{match.player2.lose}L
                              </span>
                            </>
                          ) : (
                            <span className="text-muted-foreground">En attente</span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          {match.status === "completed" && `Vainqueur: ${match.winner}`}
                          {match.status === "ongoing" && "En cours"}
                          {match.status === "pending" && "En attente"}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
