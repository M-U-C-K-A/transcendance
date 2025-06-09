import Link from "next/link"
import { PlayCircle, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/i18n-client"
import { useJWT } from "@/hooks/use-jwt"
import { useState, useEffect } from "react"
import { Match } from "@prisma/client"

interface GameTabsContentProps {
  locale: string
}

/**
 * Renders the QuickMatchContent component, which displays information and actions
 * related to the Quick Match game mode.
 */
export function QuickMatchContent({ locale }: GameTabsContentProps) {
  const t = useI18n()

  return (
	<Card className="overflow-hidden flex h-full min-h-[650px] max-h-[650px] flex-col justify-between border bg-card py-6 shadow-sm">
	  <CardHeader>
		<CardTitle>{t("dashboard.game.quickMatch")}</CardTitle>
		<CardDescription className="text-muted-foreground">
		  {t("dashboard.game.quickMatchDesc")}
		</CardDescription>
	  </CardHeader>
	  <CardContent className="flex w-full">
		<div className="w-full mb-6 flex overflow-hidden aspect-video items-center justify-center rounded-lg bg-muted">
			<div className="text-center">
				<PlayCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
			<h3 className="mb-2 text-xl font-bold">{t("dashboard.game.readyToPlay")}</h3>
			<p className="mb-4 text-muted-foreground">{t("dashboard.game.startDesc")}</p>
			</div>
		</div>
		{/*
		<video className="w-full rounded-md" autoPlay loop muted>
		  <source src="/3dpong.mp4" type="video/mp4" />
		</video>*/}
	  </CardContent>
	  <CardFooter>
		<Link href={`/${locale}/game/quickmatch`} className="w-full">
		  <Button className="w-full">{t("dashboard.game.start")}</Button>
		</Link>
	  </CardFooter>
	</Card>
  )
}

/**
 * Renders the CustomGameContent component, which displays information and actions
 * related to the Custom Game mode.
 */
export function CustomGameContent({ locale }: GameTabsContentProps) {
  const t = useI18n()
  const jwt = useJWT()

  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
	const fetchMatches = async () => {
	  try {
		const res = await fetch("/api/match/list/", {
		  headers: {
			Authorization: `Bearer ${jwt}`,
		  },
		})
		if (!res.ok) throw new Error("Failed to fetch matches")
			console.log(res)
		const data = await res.json()
		setMatches(data)
	  } catch (err) {
		setError(err instanceof Error ? err.message : "Unknown error")
	  }
	}
	if (jwt) fetchMatches()
  }, [jwt])

  return (
	<Card className="flex h-full min-h-[650px] max-h-[650px] flex-col justify-between border bg-card py-6 shadow-sm">
	  <CardHeader>
		<CardTitle>{t("dashboard.game.customGame")}</CardTitle>
		<CardDescription className="text-muted-foreground">
		  {t("dashboard.game.customGameDesc")}
		</CardDescription>
	  </CardHeader>
	  <CardContent>
		<div className="mb-6 grid grid-cols-1">
		  <Card className="h-[250px] border bg-muted/50">
			<CardHeader className="pb-2">
			  <CardTitle className="text-lg">{t("dashboard.game.create")}</CardTitle>
			</CardHeader>
			<CardContent className="pt-2">
			  <p className="mb-4 text-sm text-muted-foreground">
				{t("dashboard.game.createTournamentDesc")}
			  </p>
			</CardContent>
			<CardFooter>
			  <Link href={`/${locale}/game/custom/create`} className="w-full">
				<Button variant="outline" className="w-full">
				  {t("dashboard.game.create")}
				</Button>
			  </Link>
			</CardFooter>
		  </Card>
		</div>

		<h3 className="mb-4 font-medium">{t("dashboard.game.availableGames")}</h3>
		<div className="h-[200px] space-y-2 overflow-y-scroll">
		  {error ? (
			<p className="text-red-500 mx-2">{error}</p>
		  ) : matches.length > 0 ? (
			matches
			  .filter((game) => game.p2Id === null)
			  .map((game) => (
				<div
				  key={game.id}
				  className="flex items-center justify-between rounded-lg bg-muted p-4 mx-2"
				>
				  <div>
					<p className="font-medium">{game.name}</p>
					<p className="text-sm text-muted-foreground">
					  1/2 {t("dashboard.game.players")}
					</p>
				  </div>
				  <Link href={`/${locale}/game/custom/join/${game.id}`}>
					<Button size="sm" variant="outline">
					  {t("dashboard.game.join")}
					</Button>
				  </Link>
				</div>
			  ))
		  ) : (
			<p className="text-sm text-muted-foreground mx-2">{("dashboard.game.noAvailableGames")}</p>
		  )}
		</div>
	  </CardContent>
	</Card>
  )
}

/**
 * Renders the TournamentContent component, which displays information and actions
 * related to the Tournament game mode.
 */
export function TournamentContent({ locale }: GameTabsContentProps) {
  const t = useI18n()

	return (
		<Card className="flex h-full min-h-[650px] max-h-[650px] flex-col justify-between border bg-card py-6 shadow-sm">
	  <CardHeader>
		<CardTitle>{t("dashboard.game.tournament")}</CardTitle>
		<CardDescription className="text-muted-foreground">
		  {t("dashboard.game.tournamentDesc")}
		</CardDescription>
	  </CardHeader>
	  <CardContent>
		<div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
		  <Card className="border bg-muted/50 h-[250px]">
			<CardHeader className="pb-2">
			  <CardTitle className="text-lg">{t("dashboard.game.createTournament")}</CardTitle>
			</CardHeader>
			<CardContent className="pt-2">
			  <p className="mb-4 text-sm text-muted-foreground">
				{t("dashboard.game.createTournamentDesc")}
			  </p>
			</CardContent>
			<CardFooter>
			  <Link href={`/${locale}/game/tournament/create`} className="w-full">
				<Button variant="outline" className="w-full">
				  {t("dashboard.game.create")}
				</Button>
			  </Link>
			</CardFooter>
		  </Card>
		  <Card className="border bg-muted/50 h-[250px]">
			<CardHeader className="pb-2">
			  <CardTitle className="text-lg">{t("dashboard.game.activeTournaments")}</CardTitle>
			</CardHeader>
			<CardContent className="pt-2">
			  <p className="mb-4 text-sm text-muted-foreground">
				{t("dashboard.game.activeTournamentsDesc")}
			  </p>
			</CardContent>
			<CardFooter>
			  <Link href={`/${locale}/game/tournament/join`} className="w-full">
				<Button variant="outline" className="w-full">
				  {t("dashboard.game.view")}
				</Button>
			  </Link>
			</CardFooter>
		  </Card>
		</div>

		<h3 className="mb-4 font-medium">{t("dashboard.game.upcomingTournaments")}</h3>
		<div className="space-y-2 overflow-y-scroll h-[200px]">
		  {[
			{ name: "Championnat mensuel", date: "15 Mai 2025", players: "32" },
			{ name: "Coupe des débutants", date: "22 Mai 2025", players: "16" },
			{ name: "Tournoi Elite", date: "1 Juin 2025", players: "8" },
		  ].map((tournament, index) => (
			<div
			  key={index}
			  className="flex items-center justify-between rounded-lg bg-muted p-4 mx-2"
			>
			  <div>
				<div className="flex items-center">
				  <Trophy className="mr-2 h-4 w-4 text-yellow-400" />
				  <p className="font-medium">{tournament.name}</p>
				</div>
				<p className="text-sm text-muted-foreground">
				  {tournament.date} • {tournament.players} {t("dashboard.game.players")}
				</p>
			  </div>
			  <Button size="sm" variant="outline">
				{t("dashboard.game.register")}
			  </Button>
			</div>
		  ))}
		</div>
	  </CardContent>
	</Card>
  )
}
