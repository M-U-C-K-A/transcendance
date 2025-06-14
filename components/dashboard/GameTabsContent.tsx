import Link from "next/link"
import {
  PlayCircle,
  RocketIcon,
  Settings2Icon,
  CheckCircle2Icon,
  PlusIcon,
  InfoIcon,
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
  AwardIcon,
  BookmarkIcon,
  SearchIcon,
  BarChart2Icon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useI18n } from "@/i18n-client"
import { useJWT } from "@/hooks/use-jwt"
import { useState, useEffect } from "react"

interface GameTabsContentProps {
  locale: string
}

const FeatureStep = ({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) => (
  <div className="flex items-start gap-4">
    <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
)

const ProTipCard = ({ content }: { content: string }) => (
  <div className="mt-6 rounded-lg bg-muted p-4">
    <h4 className="mb-2 text-sm font-medium flex items-center">
      <InfoIcon className="mr-2 h-4 w-4" />
      Pro Tip
    </h4>
    <p className="text-xs text-muted-foreground">{content}</p>
  </div>
)

const PrimaryActionButton = ({ href, icon: Icon, text }: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  text: string
}) => (
  <Link href={href} className="w-full">
    <Button className="w-full gap-2">
      <Icon className="h-4 w-4" />
      {text}
    </Button>
  </Link>
)

export function QuickMatchContent({ locale }: GameTabsContentProps) {
  const t = useI18n()

  return (
    <Card className="flex h-full min-h-[700px] max-h-[700px] flex-col justify-between border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RocketIcon className="h-5 w-5 text-primary" />
          {t("dashboard.game.quickMatch")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("dashboard.game.quickMatchDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <Alert className="border-primary">
          <InfoIcon className="h-4 w-4 text-primary" />
          <AlertTitle>{t("dashboard.game.whatIsQuickMatch")}</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{t("dashboard.game.quickMatchExplanation1")}</p>
            <p>{t("dashboard.game.quickMatchExplanation2")}</p>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Settings2Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{t("dashboard.game.howItWorks")}</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <FeatureStep
              icon={SearchIcon}
              title={t("dashboard.game.step1")}
              description={t("dashboard.game.step1Desc")}
            />
            <FeatureStep
              icon={UsersIcon}
              title={t("dashboard.game.step2")}
              description={t("dashboard.game.step2Desc")}
            />
            <FeatureStep
              icon={TrophyIcon}
              title={t("dashboard.game.step3")}
              description={t("dashboard.game.step3Desc")}
            />
            <FeatureStep
              icon={BarChart2Icon}
              title={t("dashboard.game.step4")}
              description={t("dashboard.game.step4Desc")}
            />
          </CardContent>

          <CardFooter>
            <PrimaryActionButton
              href={`/${locale}/game/quickmatch`}
              icon={PlayCircle}
              text={t("dashboard.game.start")}
            />
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )
}

export function CustomGameContent({ locale }: GameTabsContentProps) {
  const t = useI18n()
  const jwt = useJWT()
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/match/list", {
          headers: { Authorization: `Bearer ${jwt}` },
        })
        if (!res.ok) throw new Error("Failed to fetch matches")
        setMatches(await res.json())
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }
    if (jwt) fetchMatches()
  }, [jwt])

  return (
    <Card className="flex h-full min-h-[700px] max-h-[700px] flex-col justify-between border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon className="h-5 w-5 text-primary" />
          {t("dashboard.game.customGame")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("dashboard.game.customGameDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-6">
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

          <Card className="border">
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

              <Separator className="my-4" />

              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2Icon className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{t(`dashboard.game.advantage${i}`)}</span>
                  </div>
                ))}
              </div>

              <ProTipCard content={t("dashboard.game.proTipContent")} />
            </CardContent>

            <CardFooter>
              <PrimaryActionButton
                href={`/${locale}/game/custom`}
                icon={PlusIcon}
                text={t("dashboard.game.create")}
              />
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

export function TournamentContent({ locale }: GameTabsContentProps) {
  const t = useI18n()

  return (
    <Card className="flex h-full min-h-[700px] max-h-[700px] flex-col justify-between border bg-card shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <TrophyIcon className="h-5 w-5 text-primary" />
          <CardTitle>{t("dashboard.tournament.title")}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          {t("dashboard.tournament.description")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-6">
          <Alert className="border-primary">
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

          <Card className="border">
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

              <ProTipCard content={t("dashboard.tournament.proTipContent")} />
            </CardContent>

            <CardFooter className="flex gap-3">
              <PrimaryActionButton
                href={`/${locale}/tournament/create`}
                icon={PlusIcon}
                text={t("dashboard.tournament.createButton")}
              />
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
