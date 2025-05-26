import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, Trophy } from "lucide-react"
import { useI18n } from "@/i18n-client"

interface GameTabsContentProps {
	locale: string
}

/**
 * Renders the QuickMatchContent component, which displays information and actions
 * related to the Quick Match game mode. It includes a title, description, and a button
 * to start a quick match game.
 *
 * @param {GameTabsContentProps} props - The component props.
 * @param {string} props.locale - The locale for internationalization.
 *
 * @returns {JSX.Element} The rendered QuickMatchContent component.
 */
export function QuickMatchContent({ locale }: GameTabsContentProps) {
	const t = useI18n()

	return (
		<Card className="bg-card border shadow-sm min-h-[800px] h-full max-h-[800px] flex flex-col justify-between py-12">
			<CardHeader>
				<CardTitle>{t('dashboard.game.quickMatch')}</CardTitle>
				<CardDescription className="text-muted-foreground">
					{t('dashboard.game.quickMatchDesc')}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
					<div className="text-center">
						<PlayCircle className="h-16 w-16 text-primary mx-auto mb-4" />
						<h3 className="text-xl font-bold mb-2">{t('dashboard.game.readyToPlay')}</h3>
						<p className="text-muted-foreground mb-4">{t('dashboard.game.startDesc')}</p>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Link href={`/${locale}/game/quickmatch`} className="w-full">
					<Button className="w-full">{t('dashboard.game.start')}</Button>
				</Link>
			</CardFooter>
		</Card>
	)
}

/**
 * Renders the CustomGameContent component, which displays information and actions
 * related to the Custom Game mode. It includes options to create or join custom games,
 * along with a list of available games that can be joined. Each option is presented
 * as a card with a title, description, and corresponding action button.
 *
 * @param {GameTabsContentProps} props - The component props.
 * @param {string} props.locale - The locale for internationalization.
 *
 * @returns {JSX.Element} The rendered CustomGameContent component.
 */
export function CustomGameContent({ locale }: GameTabsContentProps) {
	const t = useI18n()

	return (
		<Card className="bg-card border shadow-sm min-h-[800px] h-full max-h-[800px] flex flex-col justify-between py-12">
			<CardHeader>
				<CardTitle>{t('dashboard.game.customGame')}</CardTitle>
				<CardDescription className="text-muted-foreground">
					{t('dashboard.game.customGameDesc')}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
					<Card className="bg-muted/50 border">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg">{t('dashboard.game.create')}</CardTitle>
						</CardHeader>
						<CardContent className="pt-2">
							<p className="text-sm text-muted-foreground mb-4">{t('dashboard.game.createTournamentDesc')}</p>
						</CardContent>
						<CardFooter>
							<Link href={`/${locale}/game/custom/create`} className="w-full">
								<Button variant="outline" className="w-full">
									{t('dashboard.game.create')}
								</Button>
							</Link>
						</CardFooter>
					</Card>
					<Card className="bg-muted/50 border">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg">{t('dashboard.game.join')}</CardTitle>
						</CardHeader>
						<CardContent className="pt-2">
							<p className="text-sm text-muted-foreground mb-4">
								{t('dashboard.game.activeTournamentsDesc')}
							</p>
						</CardContent>
						<CardFooter>
							<Link href={`/${locale}/game/custom/join`} className="w-full">
								<Button variant="outline" className="w-full">
									{t('dashboard.game.join')}
								</Button>
							</Link>
						</CardFooter>
					</Card>
				</div>

				<h3 className="font-medium mb-4">{t('dashboard.game.availableGames')}</h3>
				<div className="space-y-4">
					{["Partie de Bob", "Tournoi amical", "Débutants bienvenus"].map((game, index) => (
						<div key={index} className="flex items-center justify-between bg-muted p-4 rounded-lg">
							<div>
								<p className="font-medium">{game}</p>
								<p className="text-sm text-muted-foreground">2/4 {t('dashboard.game.players')}</p>
							</div>
							<Button size="sm" variant="outline">
								{t('dashboard.game.join')}
							</Button>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

/**
 * Renders the TournamentContent component, which displays information and actions
 * related to the Tournament game mode. It includes options to create or join
 * tournaments, along with a list of upcoming tournaments that can be registered
 * for. Each option is presented as a card with a title, description, and
 * corresponding action button.
 *
 * @param {GameTabsContentProps} props - The component props.
 * @param {string} props.locale - The locale for internationalization.
 *
 * @returns {JSX.Element} The rendered TournamentContent component.
 */
export function TournamentContent({ locale }: GameTabsContentProps) {
	const t = useI18n()

	return (
		<Card className="bg-card border shadow-sm min-h-[800px] h-full max-h-[800px] flex flex-col justify-between py-12">
			<CardHeader>
				<CardTitle>{t('dashboard.game.tournament')}</CardTitle>
				<CardDescription className="text-muted-foreground">
					{t('dashboard.game.tournamentDesc')}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 mb-6">
					<Card className="bg-muted/50 border">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg">{t('dashboard.game.createTournament')}</CardTitle>
						</CardHeader>
						<CardContent className="pt-2">
							<p className="text-sm text-muted-foreground mb-4">{t('dashboard.game.createTournamentDesc')}</p>
						</CardContent>
						<CardFooter>
							<Link href={`/${locale}/game/tournament/create`} className="w-full">
								<Button variant="outline" className="w-full">
									{t('dashboard.game.create')}
								</Button>
							</Link>
						</CardFooter>
					</Card>
					<Card className="bg-muted/50 border">
						<CardHeader className="pb-2">
							<CardTitle className="text-lg">{t('dashboard.game.activeTournaments')}</CardTitle>
						</CardHeader>
						<CardContent className="pt-2">
							<p className="text-sm text-muted-foreground mb-4">
								{t('dashboard.game.activeTournamentsDesc')}
							</p>
						</CardContent>
						<CardFooter>
							<Link href={`/${locale}/game/tournament/join`} className="w-full">
								<Button variant="outline" className="w-full">
									{t('dashboard.game.view')}
								</Button>
							</Link>
						</CardFooter>
					</Card>
				</div>

				<h3 className="font-medium mb-4">{t('dashboard.game.upcomingTournaments')}</h3>
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
									{tournament.date} • {tournament.players} {t('dashboard.game.players')}
								</p>
							</div>
							<Button size="sm" variant="outline">
								{t('dashboard.game.register')}
							</Button>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
