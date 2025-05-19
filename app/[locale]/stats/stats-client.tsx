"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Trophy, Activity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

// Données fictives pour les graphiques
const eloData = [
  { date: "Jan", elo: 1200 },
  { date: "Fév", elo: 1250 },
  { date: "Mar", elo: 1230 },
  { date: "Avr", elo: 1300 },
  { date: "Mai", elo: 1350 },
  { date: "Juin", elo: 1400 },
  { date: "Juil", elo: 1380 },
  { date: "Août", elo: 1450 },
  { date: "Sep", elo: 1500 },
  { date: "Oct", elo: 1520 },
  { date: "Nov", elo: 1550 },
  { date: "Déc", elo: 1600 },
]

const matchData = [
  { date: "10/05", opponent: "Alice", result: "Victoire", eloChange: "+15", score: "5-3" },
  { date: "08/05", opponent: "Bob", result: "Défaite", eloChange: "-10", score: "2-5" },
  { date: "05/05", opponent: "Charlie", result: "Victoire", eloChange: "+12", score: "5-1" },
  { date: "03/05", opponent: "David", result: "Victoire", eloChange: "+8", score: "5-4" },
  { date: "01/05", opponent: "Eva", result: "Défaite", eloChange: "-5", score: "3-5" },
  { date: "28/04", opponent: "Frank", result: "Victoire", eloChange: "+20", score: "5-0" },
  { date: "25/04", opponent: "Grace", result: "Défaite", eloChange: "-8", score: "4-5" },
  { date: "22/04", opponent: "Henry", result: "Victoire", eloChange: "+10", score: "5-2" },
]

const rankingData = [
  { rank: 1, name: "Alice", elo: 1850, matches: 120, winRate: "68%" },
  { rank: 2, name: "Bob", elo: 1780, matches: 95, winRate: "72%" },
  { rank: 3, name: "Charlie", elo: 1720, matches: 110, winRate: "65%" },
  { rank: 4, name: "John Doe", elo: 1600, matches: 85, winRate: "60%" },
  { rank: 5, name: "David", elo: 1580, matches: 75, winRate: "58%" },
  { rank: 6, name: "Eva", elo: 1550, matches: 90, winRate: "55%" },
  { rank: 7, name: "Frank", elo: 1520, matches: 65, winRate: "52%" },
  { rank: 8, name: "Grace", elo: 1490, matches: 70, winRate: "50%" },
  { rank: 9, name: "Henry", elo: 1450, matches: 60, winRate: "48%" },
  { rank: 10, name: "Ivy", elo: 1400, matches: 55, winRate: "45%" },
]

type StatsClientProps = {
  t: any
  locale: string
}

export default function StatsClient({ t, locale }: StatsClientProps) {
  const [activeTab, setActiveTab] = useState("elo")
  const [timeRange, setTimeRange] = useState("year")

  // Fonction pour calculer la hauteur des barres du graphique
  const getBarHeight = (elo: number) => {
    const minElo = Math.min(...eloData.map((d) => d.elo))
    const maxElo = Math.max(...eloData.map((d) => d.elo))
    const range = maxElo - minElo
    return ((elo - minElo) / range) * 150 + 20 // 20px minimum height
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">{t('common.appName')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href={`/${locale}/dashboard`}>
              <Button variant="outline" size="sm">
                {t('common.dashboard')}
              </Button>
            </Link>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/dashboard`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> {t('common.back')}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t('stats.title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('stats.timeRange')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">{t('stats.timeRanges.month')}</SelectItem>
                <SelectItem value="quarter">{t('stats.timeRanges.quarter')}</SelectItem>
                <SelectItem value="year">{t('stats.timeRanges.year')}</SelectItem>
                <SelectItem value="all">{t('stats.timeRanges.all')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Profile */}
          <div className="lg:col-span-1">
            <Card className="bg-card border shadow-sm mb-6">
              <CardHeader>
                <CardTitle>{t('stats.profile.title')}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">John Doe</h2>
                <p className="text-muted-foreground mb-4">@johndoe</p>
                <div className="grid grid-cols-3 w-full gap-4 text-center mb-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">24</p>
                    <p className="text-xs text-muted-foreground">{t('stats.profile.wins')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-destructive">12</p>
                    <p className="text-xs text-muted-foreground">{t('stats.profile.losses')}</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-500">3</p>
                    <p className="text-xs text-muted-foreground">{t('stats.profile.tournaments')}</p>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary mb-4">ELO: 1600</Badge>
                <Badge className="bg-yellow-500/20 text-yellow-500 mb-4">{t('stats.profile.rank')} #4</Badge>
              </CardContent>
            </Card>

            <Card className="bg-card border shadow-sm">
              <CardHeader>
                <CardTitle>{t('stats.stats.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('stats.stats.gamesPlayed')}</span>
                    <span className="font-medium">85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('stats.stats.winRate')}</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('stats.stats.pointsScored')}</span>
                    <span className="font-medium">425</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('stats.stats.pointsConceded')}</span>
                    <span className="font-medium">320</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('stats.stats.bestStreak')}</span>
                    <span className="font-medium">7 {t('stats.stats.wins')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('stats.stats.tournamentsWon')}</span>
                    <span className="font-medium">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Stats */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="elo">{t('stats.tabs.elo')}</TabsTrigger>
                <TabsTrigger value="matches">{t('stats.tabs.matches')}</TabsTrigger>
                <TabsTrigger value="ranking">{t('stats.tabs.ranking')}</TabsTrigger>
              </TabsList>

              <TabsContent value="elo">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>{t('stats.elo.title')}</CardTitle>
                    <CardDescription>{t('stats.elo.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Graphique d'évolution ELO */}
                    <div className="h-80 w-full">
                      <div className="flex h-full">
                        {/* Axe Y */}
                        <div className="flex flex-col justify-between pr-2 text-xs text-muted-foreground">
                          <span>1600</span>
                          <span>1500</span>
                          <span>1400</span>
                          <span>1300</span>
                          <span>1200</span>
                        </div>
                        {/* Graphique */}
                        <div className="flex-1 relative">
                          {/* Lignes horizontales */}
                          <div className="absolute inset-0 flex flex-col justify-between">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div key={i} className="border-t border-muted h-0 w-full" />
                            ))}
                          </div>
                          {/* Barres */}
                          <div className="absolute inset-0 flex items-end">
                            <div className="w-full flex justify-between items-end h-full pt-4 pb-8">
                              {eloData.map((data, i) => (
                                <div key={i} className="flex flex-col items-center">
                                  <div
                                    className="w-8 bg-primary rounded-t"
                                    style={{ height: `${getBarHeight(data.elo)}px` }}
                                  ></div>
                                  <span className="text-xs text-muted-foreground mt-2">{data.date}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{t('stats.elo.progression')}</p>
                        <p className="text-2xl font-bold text-primary">+400 {t('stats.elo.points')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{t('stats.elo.bestElo')}</p>
                        <p className="text-2xl font-bold">1620 {t('stats.elo.points')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="matches">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>{t('stats.matches.title')}</CardTitle>
                    <CardDescription>{t('stats.matches.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">{t('stats.matches.date')}</th>
                            <th className="text-left py-3 px-4 font-medium">{t('stats.matches.opponent')}</th>
                            <th className="text-left py-3 px-4 font-medium">{t('stats.matches.result')}</th>
                            <th className="text-left py-3 px-4 font-medium">{t('stats.matches.score')}</th>
                            <th className="text-right py-3 px-4 font-medium">{t('stats.matches.eloChange')}</th>
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
                                  {match.opponent}
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

              <TabsContent value="ranking">
                <Card className="bg-card border shadow-sm">
                  <CardHeader>
                    <CardTitle>{t('stats.ranking.title')}</CardTitle>
                    <CardDescription>{t('stats.ranking.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium">{t('stats.ranking.rank')}</th>
                            <th className="text-left py-3 px-4 font-medium">{t('stats.ranking.player')}</th>
                            <th className="text-right py-3 px-4 font-medium">{t('stats.ranking.elo')}</th>
                            <th className="text-right py-3 px-4 font-medium">{t('stats.ranking.matches')}</th>
                            <th className="text-right py-3 px-4 font-medium">{t('stats.ranking.winRate')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rankingData.map((player, index) => (
                            <tr key={index} className={`border-b ${player.name === "John Doe" ? "bg-primary/10" : ""}`}>
                              <td className="py-3 px-4">
                                {player.rank <= 3 ? (
                                  <div className="flex items-center">
                                    <Trophy
                                      className={`h-4 w-4 mr-1 ${
                                        player.rank === 1
                                          ? "text-yellow-500"
                                          : player.rank === 2
                                            ? "text-gray-400"
                                            : "text-amber-700"
                                      }`}
                                    />
                                    {player.rank}
                                  </div>
                                ) : (
                                  player.rank
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span className={player.name === "John Doe" ? "font-bold" : ""}>{player.name}</span>
                                  {player.name === "John Doe" && (
                                    <Badge className="ml-2 bg-primary/20 text-primary">{t('stats.ranking.you')}</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-medium">{player.elo}</td>
                              <td className="py-3 px-4 text-right text-muted-foreground">{player.matches}</td>
                              <td className="py-3 px-4 text-right text-muted-foreground">{player.winRate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
