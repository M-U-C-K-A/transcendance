import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/i18n-client"
import { QuickMatchContent, CustomGameContent, TournamentContent } from "./GameTabsContent"

interface GameTabsProps {
	locale: string
}

	/**
	 * The GameTabs component renders tabbed options for quick match, custom game,
	 * or tournament participation, determined by the locale.
	 *
	 * @param {GameTabsProps} props
	 * @returns JSX element
	 */
export function GameTabs({ locale }: GameTabsProps) {
	const t = useI18n()

	return (
		<Tabs defaultValue="quickMatch" className="w-full">
			<TabsList className="grid grid-cols-3 mb-6">
				<TabsTrigger value="quickMatch">{t('dashboard.game.quickMatch')}</TabsTrigger>
				<TabsTrigger value="customGame">{t('dashboard.game.customGame')}</TabsTrigger>
				<TabsTrigger value="tournament">{t('dashboard.game.tournament')}</TabsTrigger>
			</TabsList>

			<TabsContent value="quickMatch">
				<QuickMatchContent locale={locale} />
			</TabsContent>

			<TabsContent value="customGame">
				<CustomGameContent locale={locale} />
			</TabsContent>

			<TabsContent value="tournament">
				<TournamentContent locale={locale} />
			</TabsContent>
		</Tabs>
	)
}
