import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useJWT } from "@/hooks/use-jwt"
import { useIdFromJWT } from "@/hooks/use-id-from-jwt"

interface User {
	username: string
	avatar?: string
	bio?: string
	onlineStatus: boolean
	elo: number
	win: number
	lose: number
	tournamentWon: number
}

/**
 * Affiche le profil de l'utilisateur connecté.
 * Utilise l'hook {@link useJWT} pour récupérer le jeton d'accès de l'utilisateur.
 * Utilise l'API "/api/user/me" pour récupérer les informations de l'utilisateur.
 * @returns Un composant JSX qui affiche le profil de l'utilisateur connecté.
 */
export function UserProfile() {
	const jwt = useJWT()
	const id = useIdFromJWT()
	const [user, setUser] = useState<User | null>(null)

	useEffect(() => {
		const fetchUser = async () => {
			const response = await fetch("/api/profile/me", {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			})
			console.log(response)
			const data = await response.json()
			setUser(data)
		}
		fetchUser()
	}, [jwt])

	if (!user) {
		return null
	}

	return (
		<Card className="bg-card border shadow-sm">
			<CardHeader>
				<CardTitle>Profil</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col items-center">
				<Avatar className="h-24 w-24 mb-4">
					<AvatarImage src={`/profilepicture/${id}.webp`} alt={user.username} />
					<AvatarFallback className="text-2xl">jd</AvatarFallback>
				</Avatar>
				<h2 className="text-xl font-bold mb-1">{user.username}</h2>
				<p className="text-muted-foreground mb-2">@{user.username}</p>
				<p className="text-sm text-center text-muted-foreground mb-4">{user.bio}</p>
				<div className="grid grid-cols-3 w-full gap-4 text-center mb-4">
					<div>
						<p className="text-2xl font-bold text-primary">{user.win}</p>
						<p className="text-xs text-muted-foreground">Victoires</p>
					</div>
					<div>
						<p className="text-2xl font-bold text-red-400">{user.lose}</p>
						<p className="text-xs text-muted-foreground">Défaites</p>
					</div>
					<div>
						<p className="text-2xl font-bold text-yellow-400">{user.tournamentWon}</p>
						<p className="text-xs text-muted-foreground">Tournois</p>
					</div>
				</div>
				<div className="flex gap-2 mb-4">
					<Badge className="bg-primary/20 text-primary">ELO: {user.elo}</Badge>
					<Badge className="bg-yellow-500/20 text-yellow-500">Rang #1</Badge>
					<Badge variant={user.onlineStatus ? "online" : "offline"}>
  						{user.onlineStatus ? "En ligne" : "Hors ligne"}
					</Badge>
				</div>
			</CardContent>
		</Card>
	)
}

