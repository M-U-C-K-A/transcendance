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
import { useI18n } from "@/i18n-client"

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
  const t = useI18n()
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
          throw new Error(t('profile.errors.fetchFailed'))
        }
        const data = await response.json()
        setProfileData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('profile.errors.unknown'))
        console.error(t('profile.errors.fetchError'), err)
      } finally {
        setIsLoading(false)
      }
    }
    if (jwt && username) {
      fetchProfileData()
    }
  }, [jwt, username, t])

  if (isLoading) {
    return <ProfileSkeleton locale={locale} />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t('common.error')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard">
              <Button variant="outline">{t('profile.returnToDashboard')}</Button>
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
            <CardTitle>{t('profile.notFound.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('profile.notFound.description')}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard">
              <Button variant="outline">{t('profile.returnToDashboard')}</Button>
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

  const formattedMatches = matchHistory.map((match) => {
    const isPlayer1 = match.p1Id === userInfo.id
    const opponentId = isPlayer1 ? match.p2Id : match.p1Id
    const playerScore = isPlayer1 ? match.p1Score : match.p2Score
    const opponentScore = isPlayer1 ? match.p2Score : match.p1Score
    const eloChange = isPlayer1 ? match.p1EloGain : match.p2EloGain

    return {
      id: match.id,
      date: new Date(match.mDate).toLocaleDateString(),
      opponentId,
      opponent: isPlayer1 ? match.player2?.username : match.player1?.username,
      result: match.winnerId === userInfo.id ? t('profile.match.victory') : t('profile.match.defeat'),
      score: `${playerScore}-${opponentScore}`,
      eloChange: `${eloChange > 0 ? '+' : ''}${eloChange}`,
      opponentAvatar: `/profilepicture/${opponentId}.webp`,
    }
  })

  return (
    <div className="bg-background min-h-screen">
      <Header locale={locale} />

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> {t('profile.returnToDashboard')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {t('profile.title', { username: userInfo.username })}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <UserProfileCard user={userInfo} locale={locale} isBlocked={profileData.isBlocked} />

            <Card className="bg-card border shadow-sm mt-6">
              <CardHeader>
                <CardTitle>{t('profile.stats.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('profile.stats.gamesPlayed')}</span>
                    <span className="font-medium">{userInfo.win + userInfo.lose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('profile.stats.winRate')}</span>
                    <span className="font-medium">{winRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('profile.stats.pointsScored')}</span>
                    <span className="font-medium">{userInfo.pointScored}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('profile.stats.pointsConceded')}</span>
                    <span className="font-medium">{userInfo.pointConcede}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('profile.stats.tournamentsWon')}</span>
                    <span className="font-medium">{userInfo.tournamentWon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">{t('profile.tabs.overview')}</TabsTrigger>
                <TabsTrigger value="matches">{t('profile.tabs.matches')}</TabsTrigger>
                <TabsTrigger value="achievements">{t('profile.tabs.achievements')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="bg-card border shadow-sm mb-6">
                  <CardHeader>
                    <CardTitle>{t('profile.elo.title')}</CardTitle>
                    <CardDescription>{t('profile.elo.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      {t('profile.elo.chartPlaceholder')}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>{t('profile.recentMatches.title')}</CardTitle>
                    <CardDescription>
                      {t('profile.recentMatches.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {formattedMatches.slice(0, 5).map((match) => (
                        <div key={match.id} className="flex items-center justify-between bg-muted p-4 rounded-lg">
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">
                                {t('profile.match.versus', { opponent: match.opponent })}
                              </p>
                              <span className="text-xs text-muted-foreground ml-2">{match.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {t('profile.match.score', { score: match.score })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={
                                match.result === t('profile.match.victory')
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
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setActiveTab("matches")}
                    >
                      {t('profile.viewAllMatches')}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="matches">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>{t('profile.matches.title')}</CardTitle>
                    <CardDescription>
                      {t('profile.matches.description', { username: userInfo.username })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">{t('profile.matches.date')}</th>
                            <th className="text-left py-3 px-4 font-medium">{t('profile.matches.opponent')}</th>
                            <th className="text-left py-3 px-4 font-medium">{t('profile.matches.result')}</th>
                            <th className="text-left py-3 px-4 font-medium">{t('profile.matches.score')}</th>
                            <th className="text-right py-3 px-4 font-medium">{t('profile.matches.eloChange')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formattedMatches.map((match) => (
                            <tr key={match.id} className="border-b">
                              <td className="py-3 px-4 text-muted-foreground">{match.date}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={`${match.opponentAvatar}`} />
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
                                    match.result === t('profile.match.victory')
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
                    <CardTitle>{t('profile.achievements.title')}</CardTitle>
                    <CardDescription>{t('profile.achievements.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: t('profile.achievements.beginner.title'),
                          description: t('profile.achievements.beginner.description'),
                          icon: "🏓",
                          unlocked: achievements.beginner,
                        },
                        {
                          title: t('profile.achievements.humiliation.title'),
                          description: t('profile.achievements.humiliation.description'),
                          icon: "😳",
                          unlocked: achievements.humiliation,
                        },
                        {
                          title: t('profile.achievements.shamefullLose.title'),
                          description: t('profile.achievements.shamefullLose.description'),
                          icon: "🤦",
                          unlocked: achievements.shamefullLose,
                        },
                        {
                          title: t('profile.achievements.rivality.title'),
                          description: t('profile.achievements.rivality.description'),
                          icon: "⚔️",
                          unlocked: achievements.rivality,
                        },
                        {
                          title: t('profile.achievements.fairPlay.title'),
                          description: t('profile.achievements.fairPlay.description'),
                          icon: "🤝",
                          unlocked: achievements.fairPlay,
                        },
                        {
                          title: t('profile.achievements.lastSecond.title'),
                          description: t('profile.achievements.lastSecond.description'),
                          icon: "⏱️",
                          unlocked: achievements.lastSecond,
                        },
                        {
                          title: t('profile.achievements.comeback.title'),
                          description: t('profile.achievements.comeback.description'),
                          icon: "🔄",
                          unlocked: achievements.comeback,
                        },
                        {
                          title: t('profile.achievements.longGame.title'),
                          description: t('profile.achievements.longGame.description'),
                          icon: "⏳",
                          unlocked: achievements.longGame,
                        },
                        {
                          title: t('profile.achievements.winTournament.title'),
                          description: t('profile.achievements.winTournament.description'),
                          icon: "🏆",
                          unlocked: achievements.winTournament,
                        },
                        {
                          title: t('profile.achievements.friendly.title'),
                          description: t('profile.achievements.friendly.description'),
                          icon: "🤗",
                          unlocked: achievements.friendly,
                        },
                        {
                          title: t('profile.achievements.rank1.title'),
                          description: t('profile.achievements.rank1.description'),
                          icon: "🥇",
                          unlocked: achievements.rank1,
                        },
                        {
                          title: t('profile.achievements.looser.title'),
                          description: t('profile.achievements.looser.description'),
                          icon: "😢",
                          unlocked: achievements.looser,
                        },
                        {
                          title: t('profile.achievements.winner.title'),
                          description: t('profile.achievements.winner.description'),
                          icon: "😎",
                          unlocked: achievements.winner,
                        },
                        {
                          title: t('profile.achievements.scorer.title'),
                          description: t('profile.achievements.scorer.description'),
                          icon: "🎯",
                          unlocked: achievements.scorer,
                        },
                        {
                          title: t('profile.achievements.emoji.title'),
                          description: t('profile.achievements.emoji.description'),
                          icon: "😊",
                          unlocked: achievements.emoji,
                        },
                        {
                          title: t('profile.achievements.rage.title'),
                          description: t('profile.achievements.rage.description'),
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
