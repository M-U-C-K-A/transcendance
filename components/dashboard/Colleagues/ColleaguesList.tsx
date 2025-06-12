import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/i18n-client"
import { useEffect, useState, useCallback } from "react"
import { useJWT } from "@/hooks/use-jwt"
import { AddColleagueDialog } from "./AddColleagueDialog"
import { PendingInvitations } from "./PendingInvitations"
import { RemoveFriendDialog } from "./RemoveFriendDialog"
import { useFriendSocket } from "@/hooks/use-friends-socket"

interface Friend {
	id: number;
	username: string;
	status: boolean;
	avatar?: string;
}

export function ColleaguesList({ locale }: { locale: string }) {
	const jwt = useJWT()
	const t = useI18n()

	const [friends, setFriends] = useState<Friend[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	const fetchFriends = useCallback(async () => {
		try {
			const response = await fetch(`/api/friends`, {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			})
			if (!response.ok) {
				throw new Error('Failed to fetch friends')
			}
			const data = await response.json() as Array<{
  id: number;
  username: string;
  onlineStatus: boolean;
  avatar?: string;
}>

const transformed = data.map((friend): Friend => ({
  id: friend.id,
  username: friend.username,
  status: friend.onlineStatus,
  avatar: friend.avatar ?? undefined,
}))
			setFriends(transformed)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error')
		} finally {
			setLoading(false)
		}
	}, [jwt])

	useEffect(() => {
		if (jwt) fetchFriends()
	}, [jwt, fetchFriends])

	useFriendSocket((data) => {
		if (!data?.type) return

		switch (data.type) {
			case "NEW_FRIEND":
			case "REMOVED_FRIEND":
			case "FRIEND_ONLINE_STATUS":
				fetchFriends()
				break
		}
	})

	if (!jwt) {
		return (
			<Card className="bg-card border shadow-sm mt-6">
				<CardHeader>
					<CardTitle className="flex items-center">
						<Users className="mr-2 h-5 w-5" /> {t('dashboard.colleagues.title')}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{t('dashboard.colleagues.notLoggedIn')}
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return (
			<div className="space-y-4 border rounded-lg mt-4 px-4 py-6">
				<p className="text-red-500 font-semibold">{error}</p>
				{[...Array(3)].map((_, i) => (
					<div key={i} className="flex items-center space-x-3">
						<Skeleton className="h-10 w-10 rounded-full bg-red-700 opacity-50" />
						<Skeleton className="h-4 w-24 bg-red-700 opacity-50" />
					</div>
				))}
			</div>
		)
	}

	if (loading) {
		return (
			<div className="space-y-4 border rounded-lg mt-4 px-4 py-6">
				<Skeleton className="h-6 w-1/3" />
				{[...Array(3)].map((_, i) => (
					<div key={i} className="flex items-center space-x-3">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-4 w-24" />
					</div>
				))}
			</div>
		)
	}

	return (
		<Card className="bg-card border shadow-sm mt-6">
			<CardHeader>
				<CardTitle className="flex items-center">
					<Users className="mr-2 h-5 w-5" /> {t('dashboard.colleagues.title')}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4 max-h-[200px] pr-2 overflow-y-auto">
					{friends.length > 0 ? (
						friends.map((friend) => (
							<div key={friend.id} className="flex items-center justify-between">
								<div className="flex items-center min-w-[125px]">
									<Avatar className="h-8 w-8 mr-2">
										<AvatarImage
											src={`/profilepicture/${friend.id}.webp`}
											alt={friend.username}
										/>
										<AvatarFallback>{friend.username.slice(0, 2).toUpperCase()}</AvatarFallback>
									</Avatar>
									<div>
										<p className="text-sm font-medium">{friend.username}</p>
										<p className="text-xs text-muted-foreground">
											{friend.status
												? t('dashboard.colleagues.online')
												: t('dashboard.colleagues.offline')}
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Link href={`/${locale}/profile/${friend.id}`}>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 w-8 p-0"
											aria-label={`${t('dashboard.colleagues.viewProfile')} ${friend.username}`}
										>
											<SquareArrowOutUpRight className="h-4 w-4" />
										</Button>
									</Link>
									<RemoveFriendDialog
										jwt={jwt}
										username={friend.username}
										userId={friend.id}
										onRemove={() =>
											setFriends(prev => prev.filter(f => f.id !== friend.id))
										}
									/>
								</div>
							</div>
						))
					) : (
						<p className="text-sm text-muted-foreground">{t('dashboard.colleagues.noFriends')}</p>
					)}
				</div>

				{/* ✅ Invitations en attente */}
				<PendingInvitations locale={locale} />
			</CardContent>
			<CardFooter>
				<AddColleagueDialog />
			</CardFooter>
		</Card>
	)
}
