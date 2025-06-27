"use client"

import { use, useEffect, useState } from "react"
import { Header } from "@/components/dashboard/Header"
import { UserProfile } from "@/components/dashboard/UserProfile"
import { ColleaguesList } from "@/components/dashboard/Colleagues/ColleaguesList"
import { GameTabs } from "@/components/dashboard/GameTabs"
import { ChatSection } from "@/components/dashboard/ChatSection"

export default function DashboardClient({ locale }: { locale: string }) {
	const [username, setUsername] = useState<string | null>(null)

	useEffect(() => {
		const keysToRemove = [
			"currentGameId",
			"currentGameName",
			"tournamentBracket",
			"tournamentId",
			"tournamentParticipants",
			"tournamentSlot"
		]
		keysToRemove.forEach(key => localStorage.removeItem(key))
	}, [])

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await fetch("/api/profile/me", {
					method: "GET",
					credentials: "include",
				})

				if (res.ok) {
					const data = await res.json()
					setUsername(data.username)
				} else {
					console.error("Erreur lors de la récupération du profil")
				}
			} catch (err) {
				console.error("Erreur fetch /api/profile/me :", err)
			}
		}

		fetchProfile()
	}, [])

	return (
		<div className="bg-background min-h-screen">
			<Header locale={locale} />

			<div className="container mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* Left Sidebar */}
				<div className="lg:col-span-3">
					<UserProfile />
					<ColleaguesList locale={locale} />
				</div>

				{/* Main Content */}
				<div className="lg:col-span-6">
					<GameTabs locale={locale} />
				</div>

				{/* Right Sidebar */}
				<div className="lg:col-span-3">
					{/* 🔹 Attendre d’avoir le username avant de rendre le chat */}
					<ChatSection currentUser={username} />
				</div>
			</div>
		</div>
	)
}

