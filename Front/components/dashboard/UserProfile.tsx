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
  import { useI18n } from "@/i18n-client"

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

  export function UserProfile() {
	const t = useI18n()
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const fetchUser = async () => {
	  try {
		const response = await fetch("/api/profile/me", {
		  method: "GET",
		  credentials: "include",
		  headers: {
			"Accept": "application/json",
		  },
		})

		if (!response.ok) {
		  throw new Error("Échec de la récupération du profil utilisateur.")
		}

		const data = await response.json()
		setUser(data)
	  } catch (err) {
		console.error("Erreur lors du chargement de l'utilisateur :", err)
		setUser(null)
	  } finally {
		setLoading(false)
	  }
	}

	useEffect(() => {
	  fetchUser()
	}, [])

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
			</div>
		  </CardContent>
		</Card>
	  )
	}

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
		  </div>
		</CardContent>
	  </Card>
	)
  }
