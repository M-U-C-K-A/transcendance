import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { useJWT } from "@/hooks/use-jwt"
import { useIdFromJWT } from "@/hooks/use-id-from-jwt"
import { useI18n } from "@/i18n-client"

interface User {
	username: string
	avatar?: string // base64 string attendue ici
	bio?: string
	onlineStatus: boolean
	elo: number
	win: number
	lose: number
	tournamentWon: number
}

export function UserProfile() {
	const t = useI18n()
	const jwt = useJWT()
	const id = useIdFromJWT()
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		if (!jwt) {
			setLoading(false)
			return
		}

		const fetchUser = async () => {
			try {
				const response = await fetch("/api/profile/me", {
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				})
				if (!response.ok) throw new Error("Failed to fetch user")

				const data = await response.json()
				setUser(data)
			} catch (err) {
				console.error(err)
			} finally {
				setLoading(false)
			}
		}

		fetchUser()
	}, [jwt])

	// Pas de JWT
	if (!jwt && !loading) {
		return (
			<Card className="bg-card border shadow-sm p-6 text-center">
				<p className="text-muted-foreground">{t('Profile.noAuth')}</p>
			</Card>
		)
	}

	// Chargement
	if (loading) {
		return (
			<Card className="bg-card border shadow-sm">
				<CardHeader>
					<CardTitle>{t('Profile.title')}</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center">
					<Skeleton className="h-24 w-24 rounded-full mb-4" />
					<Skeleton className="h-6 w-40 mb-2" />
					<Skeleton className="h-4 w-28 mb-4" />
					<div className="grid grid-cols-3 w-full gap-4 text-center mb-4">
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
						<Skeleton className="h-10" />
					</div>
					<div className="flex gap-2 mb-4">
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-6 w-20" />
					</div>
				</CardContent>
			</Card>
		)
	}

	// User non trouvé
	if (!user) {
		return (
			<Card className="bg-card border shadow-sm p-6 text-center">
				<p className="text-muted-foreground">{t('Profile.loadError')}</p>
			</Card>
		)
	}

	return (
		<Card className="bg-card border shadow-sm">
			<CardHeader>
				<CardTitle>{t('Profile.title')}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col items-center">
				<Avatar className="h-24 w-24 mb-4">
					{user.avatar ? (
						<AvatarImage
							src={`data:image/webp;base64,${user.avatar}`}
							alt={user.username}
						/>
					) : (
						<AvatarFallback className="text-2xl">
							{user?.username?.slice(0, 2).toUpperCase() || "??"}
						</AvatarFallback>
					)}
				</Avatar>
				<h2 className="text-xl font-bold mb-1">{user.username}</h2>
				<p className="text-muted-foreground mb-2">@{user.username}</p>
				<p className="text-sm text-center text-muted-foreground mb-4">{user.bio}</p>
				<div className="grid grid-cols-3 w-full gap-4 text-center mb-4">
					<div>
						<p className="text-2xl font-bold text-primary">{user.win}</p>
						<p className="text-xs text-muted-foreground">{t('Profile.stats.wins')}</p>
					</div>
					<div>
						<p className="text-2xl font-bold text-red-400">{user.lose}</p>
						<p className="text-xs text-muted-foreground">{t('Profile.stats.losses')}</p>
					</div>
					<div>
						<p className="text-2xl font-bold text-yellow-400">{user.tournamentWon}</p>
						<p className="text-xs text-muted-foreground">{t('Profile.stats.tournaments')}</p>
					</div>
				</div>
				<div className="flex gap-2 mb-4">
					<Badge className="bg-primary/20 text-primary">ELO: {user.elo}</Badge>
					<Badge variant={user.onlineStatus ? "offline" : "online"}>
						{user.onlineStatus
							? t('Profile.status.offline')
							: t('Profile.status.online')}
					</Badge>
				</div>
			</CardContent>
		</Card>
	)
}
