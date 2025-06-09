"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton"
import { Header } from "@/components/dashboard/Header"
import { UserProfileCard } from "@/components/profile/UserInfo"
import { useJWT } from "@/hooks/use-jwt"

interface UserInfo {
  id: number
  username: string
  elo: number
  avatar?: string | null
  win: number
  lose: number
  onlineStatus: boolean
  tournamentWon: number
  pointScored: number
  pointConcede: number
}

interface Match {
  id: number
  p1Id: number
  p2Id: number
  p1Elo: number
  p2Elo: number
  winnerId: number
  p1Score: number
  p2Score: number
  p1EloGain: number
  p2EloGain: number
  MDate: string
  matchType: string
}

interface Achievements {
  id: number
  beginner: boolean
  humiliation: boolean
  shamefullLose: boolean
  rivality: boolean
  fairPlay: boolean
  lastSecond: boolean
  comeback: boolean
  longGame: boolean
  winTournament: boolean
  friendly: boolean
  rank1: boolean
  looser: boolean
  winner: boolean
  scorer: boolean
  emoji: boolean
  rage: boolean
}

interface ProfileData {
  userInfo: UserInfo
  matchHistory: Match[]
  achievements: Achievements
  isBlocked: boolean
}

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const locale = params.locale as string
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const jwt = useJWT()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/profile/${username}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }
        const data = await response.json()
        setProfileData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching profile data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    if (jwt && username) {
    fetchProfileData()
  }
}, [jwt, username])


  if (isLoading) {
    return <ProfileSkeleton locale={locale} />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!profileData || !profileData.userInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested profile does not exist.</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { userInfo, matchHistory, achievements } = profileData
  const winCount = userInfo.win || 0
  const loseCount = userInfo.lose || 0
  const winRate = winCount + loseCount > 0 ? Math.round((winCount / (winCount + loseCount)) * 100) : 0

  const formattedMatches = matchHistory.map(match => {
    const isPlayer1 = match.p1Id === userInfo.id
    const opponentId = isPlayer1 ? match.p2Id : match.p1Id
    const playerScore = isPlayer1 ? match.p1Score : match.p2Score
    const opponentScore = isPlayer1 ? match.p2Score : match.p1Score
    const eloChange = isPlayer1 ? match.p1EloGain : match.p2EloGain

    return {
      id: match.id,
      date: new Date(match.MDate).toLocaleDateString(),
      opponent: `User ${opponentId}`,
      result: match.winnerId === userInfo.id ? "Victoire" : "Défaite",
      score: `${playerScore}-${opponentScore}`,
      eloChange: `${eloChange > 0 ? '+' : ''}${eloChange}`
    }
  })

  return (
    <div className="bg-background min-h-screen">
      <Header locale={locale} />

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Profil de {userInfo.username}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">

      <UserProfileCard user={userInfo} locale={locale} isBlocked={profileData.isBlocked} />

            <Card className="bg-card border shadow-sm mt-6">
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parties jouées</span>
                    <span className="font-medium">{userInfo.win + userInfo.lose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taux de victoire</span>
                    <span className="font-medium">{winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points marqués</span>
                    <span className="font-medium">{userInfo.pointScored}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Points concédés</span>
                    <span className="font-medium">{userInfo.pointConcede}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tournois gagnés</span>
                    <span className="font-medium">{userInfo.tournamentWon}</span>
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
                      Graphique d&apos;évolution ELO (similaire à celui de la page stats)
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
                      {formattedMatches.slice(0, 5).map((match) => (
                        <div key={match.id} className="flex items-center justify-between bg-muted p-4 rounded-lg">
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
                              className={`font-medium ${match.eloChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
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
                    <CardDescription>Tous les matchs joués par {userInfo.username}</CardDescription>
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
                          {formattedMatches.map((match) => (
                            <tr key={match.id} className="border-b">
                              <td className="py-3 px-4 text-muted-foreground">{match.date}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={`/profilepicture/${match.id}.webp`} />
                                    <AvatarFallback>{match.opponent.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className="hover:underline">
                                    {match.opponent}
                                  </span>
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
                                className={`py-3 px-4 text-right font-medium ${match.eloChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}
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
                          unlocked: achievements.beginner,
                        },
                        {
                          title: "Humiliation",
                          description: "Gagner une partie sans concéder de point",
                          icon: "😳",
                          unlocked: achievements.humiliation,
                        },
                        {
                          title: "Défaite Honteuse",
                          description: "Perdre une partie sans marquer de point",
                          icon: "🤦",
                          unlocked: achievements.shamefullLose,
                        },
                        {
                          title: "Rivalité",
                          description: "Jouer plusieurs fois contre le même adversaire",
                          icon: "⚔️",
                          unlocked: achievements.rivality,
                        },
                        {
                          title: "Fair Play",
                          description: "Jouer de manière exemplaire",
                          icon: "🤝",
                          unlocked: achievements.fairPlay,
                        },
                        {
                          title: "Dernière Seconde",
                          description: "Gagner une partie au dernier moment",
                          icon: "⏱️",
                          unlocked: achievements.lastSecond,
                        },
                        {
                          title: "Comeback",
                          description: "Gagner après avoir été mené",
                          icon: "🔄",
                          unlocked: achievements.comeback,
                        },
                        {
                          title: "Partie Longue",
                          description: "Jouer une partie de plus de 10 minutes",
                          icon: "⏳",
                          unlocked: achievements.longGame,
                        },
                        {
                          title: "Champion de Tournoi",
                          description: "Remporter un tournoi",
                          icon: "🏆",
                          unlocked: achievements.winTournament,
                        },
                        {
                          title: "Amical",
                          description: "Jouer une partie amicale",
                          icon: "🤗",
                          unlocked: achievements.friendly,
                        },
                        {
                          title: "Numéro 1",
                          description: "Atteindre la première place du classement",
                          icon: "🥇",
                          unlocked: achievements.rank1,
                        },
                        {
                          title: "Perdant",
                          description: "Perdre 10 parties",
                          icon: "😢",
                          unlocked: achievements.looser,
                        },
                        {
                          title: "Vainqueur",
                          description: "Gagner 10 parties",
                          icon: "😎",
                          unlocked: achievements.winner,
                        },
                        {
                          title: "Buteur",
                          description: "Marquer 100 points",
                          icon: "🎯",
                          unlocked: achievements.scorer,
                        },
                        {
                          title: "Émotif",
                          description: "Utiliser tous les emojis disponibles",
                          icon: "😊",
                          unlocked: achievements.emoji,
                        },
                        {
                          title: "Rageux",
                          description: "Quitter une partie en cours",
                          icon: "😠",
                          unlocked: achievements.rage,
                        },
                      ].map((achievement, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-4 rounded-lg border ${achievement.unlocked ? "bg-primary/10 border-primary/20" : "bg-muted/50 border-muted"}`}
                        >
                          <div
                            className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 text-2xl ${achievement.unlocked ? "bg-primary/20" : "bg-muted"}`}
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

