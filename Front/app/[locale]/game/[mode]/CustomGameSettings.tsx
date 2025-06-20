"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/i18n-client"
import { QuickMatchSettings, QuickMatchSettingsProps } from "./QuickMatchSettings"

const gameCreationSchema = z.object({
	name: z.string().min(3, "Le nom doit faire au moins 3 caractères").max(30),
})

interface Player {
	id: string
	name: string
	ready?: boolean
}

interface CustomGameSettingsProps extends QuickMatchSettingsProps {
	onStart: () => void
}

export default function CustomGameSettings(props: CustomGameSettingsProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [showCustomDialog, setShowCustomDialog] = useState(false)
	const [gameInfo, setGameInfo] = useState<{
		id: string
		name: string
		players: Player[]
		status?: "waiting" | "starting" | "ongoing"
	} | null>(null)

	const router = useRouter()
	const form = useForm({
		resolver: zodResolver(gameCreationSchema),
		defaultValues: {
			name: "",
		},
	})
	const t = useI18n()

	useEffect(() => {
		const storedGameId = localStorage.getItem("currentGameId")
		const storedGameName = localStorage.getItem("currentGameName")
		if (!storedGameId || !storedGameName) {
			setShowCustomDialog(true)
		} else if (!gameInfo) {
			setGameInfo({
				id: storedGameId,
				name: storedGameName,
				players: [],
				status: "waiting",
			})
		}
	}, [])

	const createCustomGame = async (name: string) => {
		setIsLoading(true)
		try {
			const response = await fetch("/api/game/custom", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
				},
				body: JSON.stringify({ name }),
			})

			if (!response.ok) throw new Error("Erreur lors de la création de la partie.")

			const data = await response.json()

			localStorage.setItem("currentGameId", data.hashedCode)
			localStorage.setItem("currentGameName", data.name)

			setGameInfo({
				id: data.hashedCode,
				name: data.name,
				players: [],
				status: "waiting",
			})

			setShowCustomDialog(false)
		} catch (error) {
			console.error("Erreur création partie custom:", error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			{showCustomDialog && (
				<Dialog open={showCustomDialog} onOpenChange={() => { }}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Créer une partie personnalisée</DialogTitle>
							<DialogDescription>Choisissez un nom pour votre partie</DialogDescription>
						</DialogHeader>
						<form onSubmit={form.handleSubmit((data) => createCustomGame(data.name))} className="space-y-6">
							<div className="space-y-3">
								<Label htmlFor="customName">Nom de la partie</Label>
								<Input
									id="customName"
									{...form.register("name")}
									placeholder="Ma partie"
									disabled={isLoading}
								/>
								{form.formState.errors.name && (
									<p className="text-sm text-red-500">
										{form.formState.errors.name.message}
									</p>
								)}
							</div>
							<Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
								{isLoading ? <span className="animate-pulse">Création...</span> : "Créer la partie"}
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			)}

			<div className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

					{/* Participants */}
					<div className="lg:col-span-3 space-y-6">
						<Card className="p-5 shadow-sm rounded-xl">
							<h2 className="text-lg font-semibold mb-4 text-center">Participants</h2>
							<div className="space-y-3">
								{gameInfo?.players?.length > 0 ? (
									gameInfo.players.map((player) => (
										<div
											key={player.id}
											className="flex items-center gap-3 border rounded-lg p-3 bg-background"
										>
											<div className={`w-3 h-3 rounded-full ${player.ready ? "bg-green-500" : "bg-yellow-500"
												}`} />
											<span className="font-medium truncate">{player.name}</span>
										</div>
									))
								) : (
									<div className="p-3 text-center text-muted-foreground text-sm border rounded-lg">
										{gameInfo ? "En attente de joueurs..." : "Partie non créée"}
									</div>
								)}
							</div>
						</Card>
					</div>

					{/* Paramètres */}
					<div className="lg:col-span-9">
						<QuickMatchSettings {...props} />
					</div>
				</div>
			</div>
		</>
	)
}
