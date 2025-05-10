"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Activity, BarChart, LogOut, MessageCircle, PlayCircle, Settings, Trophy, Users } from "lucide-react"
import { ChatComponent } from "@/components/chat"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { Locale } from "@/middleware"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"

export default function DashboardClient({ dict, lang }: { dict: any; lang: Locale }) {
  const [activeTab, setActiveTab] = useState("quickMatch")

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">{dict.common.appName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            <Link href={`/${lang}/stats`}>
              <Button variant="ghost" size="sm">
                <BarChart className="h-5 w-5" />
              </Button>
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href={`/${lang}`}>
              <Button variant="ghost" size="sm">
                <LogOut className="h-5 w-5" />
              </Button>
            </Link>
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - User Profile */}
        <div className="lg:col-span-3">
          <Card className="bg-card border shadow-sm">
            <CardHeader>
              <CardTitle>{dict.dashboard.profile.title}</CardTitle>
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
                  <p className="text-xs text-muted-foreground">{dict.dashboard.profile.wins}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">12</p>
                  <p className="text-xs text-muted-foreground">{dict.dashboard.profile.losses}</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">3</p>
                  <p className="text-xs text-muted-foreground">{dict.dashboard.profile.tournaments}</p>
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary mb-4">{dict.dashboard.profile.level} 8</Badge>
              <ProfileEditDialog
                username="John Doe"
                email="john.doe@example.com"
                bio="Joueur passionné de Pong depuis 2023."
                onSave={(data) => console.log("Profile updated:", data)}
              />
            </CardContent>
          </Card>

          {/* Colleagues List */}
          <Card className="bg-card border shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" /> {dict.dashboard.colleagues.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Alice", "Bob", "Charlie", "David", "Eva"].map((friend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{friend.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{friend}</p>
                        <p className="text-xs text-muted-foreground">
                          {index % 2 === 0 ? dict.dashboard.colleagues.online : dict.dashboard.colleagues.offline}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                {dict.dashboard.colleagues.add}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content - Game Modes */}
        <div className="lg:col-span-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="quickMatch">{dict.dashboard.game.quickMatch}</TabsTrigger>
              <TabsTrigger value="customGame">{dict.dashboard.game.customGame}</TabsTrigger>
              <TabsTrigger value="tournament">{dict.dashboard.game.tournament}</TabsTrigger>
            </TabsList>

            <TabsContent value="quickMatch">
              <Card className="bg-card border shadow-sm">
                <CardHeader>
                  <CardTitle>{dict.dashboard.game.quickMatch}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {dict.dashboard.game.quickMatchDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <PlayCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">{dict.dashboard.game.readyToPlay}</h3>
                      <p className="text-muted-foreground mb-4">{dict.dashboard.game.startDesc}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/${lang}/game/quickmatch`} className="w-full">
                    <Button className="w-full">{dict.dashboard.game.start}</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="customGame">
              <Card className="bg-card border shadow-sm">
                <CardHeader>
                  <CardTitle>{dict.dashboard.game.customGame}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {dict.dashboard.game.customGameDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-muted/50 border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{dict.dashboard.game.create}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-sm text-muted-foreground mb-4">{dict.dashboard.game.createTournamentDesc}</p>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/${lang}/game/custom/create`} className="w-full">
                          <Button variant="outline" className="w-full">
                            {dict.dashboard.game.create}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="bg-muted/50 border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{dict.dashboard.game.join}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-sm text-muted-foreground mb-4">
                          {dict.dashboard.game.activeTournamentsDesc}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/${lang}/game/custom/join`} className="w-full">
                          <Button variant="outline" className="w-full">
                            {dict.dashboard.game.join}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>

                  <h3 className="font-medium mb-4">{dict.dashboard.game.availableGames}</h3>
                  <div className="space-y-4">
                    {["Partie de Bob", "Tournoi amical", "Débutants bienvenus"].map((game, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-4 rounded-lg">
                        <div>
                          <p className="font-medium">{game}</p>
                          <p className="text-sm text-muted-foreground">2/4 {dict.dashboard.game.players}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          {dict.dashboard.game.join}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tournament">
              <Card className="bg-card border shadow-sm">
                <CardHeader>
                  <CardTitle>{dict.dashboard.game.tournament}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {dict.dashboard.game.tournamentDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-muted/50 border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{dict.dashboard.game.createTournament}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-sm text-muted-foreground mb-4">{dict.dashboard.game.createTournamentDesc}</p>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/${lang}/game/tournament/create`} className="w-full">
                          <Button variant="outline" className="w-full">
                            {dict.dashboard.game.create}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="bg-muted/50 border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{dict.dashboard.game.activeTournaments}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <p className="text-sm text-muted-foreground mb-4">
                          {dict.dashboard.game.activeTournamentsDesc}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/${lang}/game/tournament/join`} className="w-full">
                          <Button variant="outline" className="w-full">
                            {dict.dashboard.game.view}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>

                  <h3 className="font-medium mb-4">{dict.dashboard.game.upcomingTournaments}</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Championnat mensuel", date: "15 Mai 2025", players: "32" },
                      { name: "Coupe des débutants", date: "22 Mai 2025", players: "16" },
                      { name: "Tournoi Elite", date: "1 Juin 2025", players: "8" },
                    ].map((tournament, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-4 rounded-lg">
                        <div>
                          <div className="flex items-center">
                            <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
                            <p className="font-medium">{tournament.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tournament.date} • {tournament.players} {dict.dashboard.game.players}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          {dict.dashboard.game.register}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Chat */}
        <div className="lg:col-span-3">
          <Card className="bg-card border shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" /> {dict.dashboard.chat.title}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 h-[calc(100%-80px)]">
              <ChatComponent placeholder={dict.dashboard.chat.placeholder} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
