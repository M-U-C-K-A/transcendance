import Link from "next/link"
import { PlayCircle, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/i18n-client"
import { useJWT } from "@/hooks/use-jwt"
import { useState, useEffect } from "react"
import { Match } from "@prisma/client"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { RocketIcon, Settings2Icon, CheckCircle2Icon, PlusIcon, InfoIcon,
  TrophyIcon, UsersIcon, CalendarIcon,
  AwardIcon, BookmarkIcon,
  SearchIcon, HistoryIcon, BarChart2Icon  } from "lucide-react";
import { Separator } from "@/components/ui/separator"
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
		const res = await fetch("/api/match/list", {
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
      <div className="mb-6 grid grid-cols-1 gap-6">
        {/* Information Section */}
        <Alert className="border-primary">
          <RocketIcon className="h-4 w-4 text-primary" />
          <AlertTitle>{t("dashboard.game.customGameFeatures")}</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t("dashboard.game.feature1")}</li>
              <li>{t("dashboard.game.feature2")}</li>
              <li>{t("dashboard.game.feature3")}</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Main Creation Card */}
        <Card className="border bg-muted/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Settings2Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t("dashboard.game.create")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.game.createTournamentDesc")}
            </p>

            <Separator className="my-2" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t("dashboard.game.advantage1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t("dashboard.game.advantage2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                <span className="text-sm">{t("dashboard.game.advantage3")}</span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <h4 className="mb-2 text-sm font-medium">
                <InfoIcon className="mr-2 inline h-4 w-4" />
                {t("dashboard.game.proTip")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.game.proTipContent")}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/${locale}/game/custom`} className="w-full">
              <Button variant="outline" className="w-full gap-2">
                <PlusIcon className="h-4 w-4" />
                {t("dashboard.game.create")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
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

	return (    <Card className="flex h-full min-h-[650px] max-h-[650px] flex-col justify-between border bg-card py-6 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrophyIcon className="h-6 w-6 text-primary" />
          <CardTitle>{t("dashboard.tournament.title")}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          {t("dashboard.tournament.description")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-6">
          {/* Features Alert */}
          <Alert variant="default" className="border-primary">
            <AwardIcon className="h-4 w-4 text-primary" />
            <AlertTitle>{t("dashboard.tournament.featuresTitle")}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t("dashboard.tournament.feature1")}</li>
                <li>{t("dashboard.tournament.feature2")}</li>
                <li>{t("dashboard.tournament.feature3")}</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Main Tournament Card */}
          <Card className="border bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Settings2Icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{t("dashboard.tournament.createTitle")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("dashboard.tournament.createDescription")}
              </p>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    {t("dashboard.tournament.participants")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.tournament.participantsDesc")}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {t("dashboard.tournament.schedule")}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.tournament.scheduleDesc")}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted p-4">
                <h4 className="mb-2 text-sm font-medium flex items-center">
                  <InfoIcon className="mr-2 h-4 w-4" />
                  {t("dashboard.tournament.proTip")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.tournament.proTipContent")}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Link href={`/${locale}/tournament/create`} className="w-full">
                <Button className="w-full gap-2">
                  <PlusIcon className="h-4 w-4" />
                  {t("dashboard.tournament.createButton")}
                </Button>
              </Link>
              <Button variant="outline" className="gap-2">
                <BookmarkIcon className="h-4 w-4" />
                {t("dashboard.tournament.templatesButton")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
