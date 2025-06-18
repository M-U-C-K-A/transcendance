import { Suspense } from 'react'
import { DashboardSkeleton } from '@/components/dashboard/Skeleton'
import DashboardClient from './dashboard-client'
import { ThemeHandler } from '@/components/setting/theme-handler'
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Tableau de bord - Tournoi en ligne",
	description: "Accédez à votre profil, vos collègues, les jeux en cours et le chat en temps réel.",
	keywords: [
		"dashboard",
		"tournoi",
		"jeux en ligne",
		"profil utilisateur",
		"chat",
		"colleagues",
		"Next.js",
		"React",
		"multijoueur"
	],
	openGraph: {
		title: "Tableau de bord - Tournoi en ligne",
		description: "Votre espace personnel pour gérer vos jeux, discuter et participer aux tournois.",
		url: "https://tonsite.com/dashboard",
		siteName: "Tournoi en ligne",
		locale: "fr_FR",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Tableau de bord - Tournoi en ligne",
		description: "Gérez vos jeux et échangez avec vos collègues en toute simplicité.",
	},
};

type PageProps = {
	params: Promise<{
		locale: string
		jwtToken: string
	}>
}

export default async function DashboardPage({ params }: PageProps) {
	const { locale, jwtToken } = await params

	return (
		<ThemeHandler>
			<Suspense fallback={<DashboardSkeleton />}>
				<DashboardClient locale={locale} jwtToken={jwtToken} />
			</Suspense>
		</ThemeHandler>
	)
}
