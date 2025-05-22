"use client"

import { useState } from "react"
import { Copy, Plus, Trash, Users, Settings, Save, Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {ChatSection} from "@/components/dashboard/ChatSection"
import TournamentSkeleton from "@/components/tournament-skeleton"

interface Player {
  id: string
  name: string
  status: "pending" | "confirmed"
  isAdmin: boolean
}

// Données des joueurs par défaut
const defaultPlayers: Player[] = [
  { id: "admin123", name: "Admin (Vous)", status: "confirmed", isAdmin: true },
  { id: "player1", name: "Jean Dupont", status: "confirmed", isAdmin: false },
  { id: "player2", name: "Marie Martin", status: "confirmed", isAdmin: false },
  { id: "player3", name: "Lucas Bernard", status: "pending", isAdmin: false },
  { id: "player4", name: "Sophie Petit", status: "pending", isAdmin: false },
  { id: "player5", name: "Thomas Dubois", status: "pending", isAdmin: false },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [tournamentName, setTournamentName] = useState("Tournoi de Pong")
  const [maxPlayers, setMaxPlayers] = useState(8)
  const [players, setPlayers] = useState<Player[]>(defaultPlayers)
  const [newPlayerName, setNewPlayerName] = useState("")
  const [doubleElimination, setDoubleElimination] = useState(false)
  const [timeLimit, setTimeLimit] = useState(5) // minutes
  const [inviteLink, setInviteLink] = useState("")
  const [tournamentStarted, setTournamentStarted] = useState(false)
  const [countdown, setCountdown] = useState(10) // secondes avant le début
  const [countdownActive, setCountdownActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Simuler un chargement
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  })

  // Générer un lien d'invitation unique
  const generateInviteLink = () => {
    const uniqueId = Math.random().toString(36).substring(2, 10)
    const link = `${window.location.origin}/join/${uniqueId}`
    setInviteLink(link)
    return link
  }

  // Ajouter un joueur
  const addPlayer = () => {
    if (!newPlayerName) {
      setError("Veuillez entrer un nom de joueur")
      return
    }

    if (players.length >= maxPlayers) {
      setError("Le nombre maximum de joueurs est atteint")
      return
    }

    const newPlayer: Player = {
      id: Math.random().toString(36).substring(2, 10),
      name: newPlayerName,
      status: "pending",
      isAdmin: false,
    }

    setPlayers([...players, newPlayer])
    setNewPlayerName("")
    setError(null)
  }

  // Supprimer un joueur
  const removePlayer = (id: string) => {
    const playerToRemove = players.find((player) => player.id === id)

    if (playerToRemove?.isAdmin) {
      setError("Impossible de supprimer l'administrateur du tournoi")
      return
    }

    setPlayers(players.filter((player) => player.id !== id))
    setError(null)
  }

  // Copier le lien d'invitation
  const copyInviteLink = () => {
    const link = inviteLink || generateInviteLink()
    navigator.clipboard.writeText(link)
    setError(null)
  }

  // Sauvegarder les paramètres
  const saveSettings = () => {
    setError(null)
  }

  // Lancer le tournoi
  const startTournament = () => {
    if (players.length < 4) {
      setError("Il faut au moins 4 joueurs pour lancer le tournoi")
      return
    }

    setCountdownActive(true)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCountdownActive(false)
          setTournamentStarted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Gérer le changement du nombre maximum de joueurs
  const handleMaxPlayersChange = (value: number[]) => {
    const newMaxPlayers = value[0]

    if (newMaxPlayers < players.length) {
      setError(`Impossible de réduire à ${newMaxPlayers} joueurs car il y a déjà ${players.length} participants`)
      return
    }

    setMaxPlayers(newMaxPlayers)
    setError(null)
  }

  if (isLoading) {
    return <TournamentSkeleton />
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Créateur de Tournoi de Pong</h1>

        {tournamentStarted ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Tournoi en cours !</h2>
            <p className="text-lg mb-8">
              Le tournoi "{tournamentName}" a commencé avec {players.length} participants.
            </p>
            <Button variant="outline" onClick={() => setTournamentStarted(false)}>
              Retour à la configuration
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{tournamentName}</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyInviteLink}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copier le lien d'invitation
                      </Button>
                      {players.length >= 4 && (
                        <Button variant="default" size="sm" onClick={startTournament} disabled={countdownActive}>
                          <Play className="h-4 w-4 mr-2" />
                          Lancer le tournoi
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {countdownActive && (
                    <Alert className="mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      <AlertDescription>Le tournoi commence dans {countdown} secondes...</AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Tabs defaultValue="players">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="players">
                        <Users className="h-4 w-4 mr-2" />
                        Joueurs
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="players" className="space-y-4 mt-4">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            Joueurs ({players.length}/{maxPlayers})
                          </h3>
                          <Badge variant="outline">{maxPlayers - players.length} slots disponibles</Badge>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-grow">
                            <Label htmlFor="playerName">Nom du joueur</Label>
                            <Input
                              id="playerName"
                              value={newPlayerName}
                              onChange={(e) => setNewPlayerName(e.target.value)}
                              placeholder="Nom du joueur"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={addPlayer}
                          disabled={players.length >= maxPlayers}
                          className="w-full md:w-auto self-end"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter un joueur
                        </Button>
                      </div>

                      <Separator />

                      <ScrollArea className="h-[300px] rounded-md border p-4">
                        {players.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Users className="h-12 w-12 mb-2" />
                            <p>Aucun joueur inscrit</p>
                            <p className="text-sm">Ajoutez des joueurs pour commencer</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {players.map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center justify-between p-2 bg-muted/20 rounded-md"
                              >
                                <div>
                                  <p className="font-medium">
                                    {player.name} {player.isAdmin && "(Admin)"}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={player.status === "confirmed" ? "default" : "outline"}>
                                    {player.status === "confirmed" ? "Confirmé" : "En attente"}
                                  </Badge>
                                  {!player.isAdmin && (
                                    <Button variant="ghost" size="sm" onClick={() => removePlayer(player.id)}>
                                      <Trash className="h-4 w-4 text-destructive" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6 mt-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="tournamentName">Nom du tournoi</Label>
                          <Input
                            id="tournamentName"
                            value={tournamentName}
                            onChange={(e) => setTournamentName(e.target.value)}
                            placeholder="Nom du tournoi"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Nombre maximum de joueurs: {maxPlayers}</Label>
                          <Slider
                            value={[maxPlayers]}
                            min={4}
                            max={32}
                            step={2}
                            onValueChange={handleMaxPlayersChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Limite de temps par match: {timeLimit} minutes</Label>
                          <Slider
                            value={[timeLimit]}
                            min={1}
                            max={15}
                            step={1}
                            onValueChange={(value) => setTimeLimit(value[0])}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="double-elimination"
                            checked={doubleElimination}
                            onCheckedChange={setDoubleElimination}
                          />
                          <Label htmlFor="double-elimination">Double élimination</Label>
                        </div>

                        <Button onClick={saveSettings} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder les paramètres
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <ChatSection />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
