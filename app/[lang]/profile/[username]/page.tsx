"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart, LogOut, MessageCircle, Settings, Trophy, Activity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"

// Données fictives pour les profils
const profilesData = {
  johndoe: {
    name: "John Doe",
    username: "johndoe",
    avatar: "/placeholder.svg?height=96&width=96",
    elo: 1600,
    rank: 4,
    wins: 24,
    losses: 12,
    tournaments: 3,
    level: 8,
    bio: "Joueur passionné de Pong depuis 2023.",
    isCurrentUser: true,
  },
  alice: {
    name: "Alice",
    username: "alice",
    avatar: "/placeholder.svg?height=96&width=96",
    elo: 1850,
    rank: 1,
    wins: 82,
    losses: 38,
    tournaments: 5,
    level: 12,
    bio: "Championne de Pong 2024. Toujours prête pour un défi !",
    isCurrentUser: false,
  },
  bob: {
    name: "Bob",
    username: "bob",
    avatar: "/placeholder.svg?height=96&width=96",
    elo: 1780,
    rank: 2,
    wins: 68,
    losses: 27,
    tournaments: 4,
    level: 10,
    bio: "Stratège et joueur technique. J'aime les matchs serrés.",
    isCurrentUser: false,
  },
  charlie: {
    name: "Charlie",
    username: "charlie",
    avatar: "/placeholder.svg?height=96&width=96",
    elo: 1720,
    rank: 3,
    wins: 71,
    losses: 39,
    tournaments: 4,
    level: 9,
    bio: "Joueur agressif qui aime prendre des risques.",
    isCurrentUser: false,
  },
  david: {
    name: "David",
    username: "david",
    avatar: "/placeholder.svg?height=96&width=96",
    elo: 1580,
    rank: 5,
    wins: 43,
    losses: 32,
    tournaments: 2,
    level: 7,
    bio: "Nouveau dans le monde du Pong compétitif. J'apprends vite !",
    isCurrentUser: false,
  },
}

// Données fictives pour les matchs
const matchData = [
  { date: "10/05", opponent: "Alice", result: "Défaite", eloChange: "-15", score: "3-5" },
  { date: "08/05", opponent: "Bob", result: "Défaite", eloChange: "-10", score: "2-5" },
  { date: "05/05", opponent: "Charlie", result: "Victoire", eloChange: "+12", score: "5-1" },
  { date: "03/05", opponent: "David", result: "Victoire", eloChange: "+8", score: "5-4" },
  { date: "01/05", opponent: "Eva", result: "Défaite", eloChange: "-5", score: "3-5" },
  { date: "28/04", opponent: "Frank", result: "Victoire", eloChange: "+20", score: "5-0" },
  { date: "25/04", opponent: "Grace", result: "Défaite", eloChange: "-8", score: "4-5" },
  { date: "22/04", opponent: "Henry", result: "Victoire", eloChange: "+10", score: "5-2" },
]

export default function ProfilePage() {
  const params = useParams()
  const username = (params.username as string).toLowerCase()
  const [activeTab, setActiveTab] = useState("overview")

  // Récupérer les données du profil en fonction du nom d'utilisateur
  const profileData = profilesData[username as keyof typeof profilesData] || profilesData.johndoe

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">PongMaster</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            <Link href="/stats">
              <Button variant="ghost" size="sm">
                <BarChart className="h-5 w-5" />
              </Button>
            </Link>
            <ThemeToggle />
            <Link href="/">
              <Button variant="ghost" size="sm">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Profil de {profileData.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - User Profile */}
          <div className="lg:col-span-4">
            <Card className="bg-card border shadow-sm">
              <CardHeader>
                <CardTitle>Profil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
                <p className="text-muted-foreground mb-2">@{profileData.username}</p>
                <p className="text-sm text-center text-muted-foreground mb-4">{profileData.bio}</p>
                <div className="grid grid-cols-3 w-full gap-4 text-center mb-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">{profileData.wins}</p>
                    <p className="text-xs text-muted-foreground">Victoires</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">{profileData.losses}</p>
                    <p className="text-xs text-muted-foreground">Défaites</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">{profileData.tournaments}</p>
                    <p className="text-xs text-muted-foreground">Tournois</p>
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <Badge className="bg-primary/20 text-primary">ELO: {profileData.elo}</Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-500">Rang #{profileData.rank}</Badge>
                  <Badge className="bg-purple-500/20 text-purple-500">Niveau {profileData.level}</Badge>
                </div>
                {profileData.isCurrentUser ? (
                  <ProfileEditDialog
                    username={profileData.name}
                    bio={profileData.bio}
                    onSave={(data) => console.log("Profile updated:", data)}
                  />
                ) : (
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="mr-2 h-4 w-4" /> Message
                    </Button>
                    <Button className="flex-1">
                      <Trophy className="mr-2 h-4 w-4" /> Défier
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parties jouées</span>
                    <span className="font-medium">{profileData.wins + profileData.losses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taux de victoire</span>
                    <span className="font-medium">
                      {Math.round((profileData.wins / (profileData.wins + profileData.losses)) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points marqués</span>
                    <span className="font-medium">{profileData.wins * 5 + profileData.losses * 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points concédés</span>
                    <span className="font-medium">{profileData.losses * 5 + profileData.wins * 2}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meilleure série</span>
                    <span className="font-medium">
                      {profileData.rank === 1 ? "12" : profileData.rank === 2 ? "10" : "7"} victoires
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tournois gagnés</span>
                    <span className="font-medium">
                      {profileData.rank === 1 ? "3" : profileData.rank === 2 ? "2" : "1"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">Aperçu</TabsTrigger>
                <TabsTrigger value="matches">Historique des matchs</TabsTrigger>
                <TabsTrigger value="achievements">Réalisations</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="bg-card border shadow-sm mb-6">
                  <CardHeader>
                    <CardTitle>Évolution ELO</CardTitle>
                    <CardDescription>Progression du classement ELO au cours des derniers mois</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      Graphique d'évolution ELO (similaire à celui de la page stats)
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>Derniers matchs</CardTitle>
                    <CardDescription>Résultats des matchs récents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {matchData.slice(0, 5).map((match, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-4 rounded-lg">
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">vs {match.opponent}</p>
                              <span className="text-xs text-muted-foreground ml-2">{match.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Score: {match.score}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={
                                match.result === "Victoire"
                                  ? "bg-green-500/20 text-green-500"
                                  : "bg-red-500/20 text-red-500"
                              }
                            >
                              {match.result}
                            </Badge>
                            <span
                              className={`font-medium ${
                                match.eloChange.startsWith("+") ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {match.eloChange}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("matches")}>
                      Voir tous les matchs
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="matches">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>Historique des matchs</CardTitle>
                    <CardDescription>Tous les matchs joués par {profileData.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">Date</th>
                            <th className="text-left py-3 px-4 font-medium">Adversaire</th>
                            <th className="text-left py-3 px-4 font-medium">Résultat</th>
                            <th className="text-left py-3 px-4 font-medium">Score</th>
                            <th className="text-right py-3 px-4 font-medium">Δ ELO</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matchData.map((match, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 px-4 text-muted-foreground">{match.date}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarFallback>{match.opponent.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <Link href={`/profile/${match.opponent.toLowerCase()}`} className="hover:underline">
                                    {match.opponent}
                                  </Link>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  className={
                                    match.result === "Victoire"
                                      ? "bg-green-500/20 text-green-500"
                                      : "bg-red-500/20 text-red-500"
                                  }
                                >
                                  {match.result}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">{match.score}</td>
                              <td
                                className={`py-3 px-4 text-right font-medium ${
                                  match.eloChange.startsWith("+") ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {match.eloChange}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>Réalisations</CardTitle>
                    <CardDescription>Badges et trophées débloqués</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Premier Pas",
                          description: "Jouer votre première partie de Pong",
                          icon: "🏓",
                          unlocked: true,
                        },
                        {
                          title: "Première Victoire",
                          description: "Remporter votre première partie",
                          icon: "🏆",
                          unlocked: true,
                        },
                        {
                          title: "Série Gagnante",
                          description: "Gagner 5 parties consécutives",
                          icon: "🔥",
                          unlocked: true,
                        },
                        {
                          title: "Champion du Tournoi",
                          description: "Remporter un tournoi",
                          icon: "👑",
                          unlocked: profileData.rank <= 2,
                        },
                        {
                          title: "Maître du Pong",
                          description: "Atteindre un ELO de 1800",
                          icon: "⭐",
                          unlocked: profileData.elo >= 1800,
                        },
                        {
                          title: "Joueur Dévoué",
                          description: "Jouer 100 parties",
                          icon: "🎮",
                          unlocked: profileData.wins + profileData.losses >= 100,
                        },
                        {
                          title: "Stratège",
                          description: "Gagner une partie sans concéder de point",
                          icon: "🧠",
                          unlocked: profileData.rank <= 3,
                        },
                        {
                          title: "Comeback",
                          description: "Gagner une partie après avoir été mené 0-4",
                          icon: "🔄",
                          unlocked: profileData.rank <= 4,
                        },
                      ].map((achievement, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-4 rounded-lg border ${
                            achievement.unlocked ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-muted"
                          }`}
                        >
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 text-2xl ${
                              achievement.unlocked ? "bg-primary/20" : "bg-muted"
                            }`}
                          >
                            {achievement.icon}
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
