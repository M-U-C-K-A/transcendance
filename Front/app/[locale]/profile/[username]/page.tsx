"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton"
import { Header } from "@/components/dashboard/Header"
import { UserProfileCard } from "@/components/profile/UserInfo"
import { useI18n } from "@/i18n-client"

interface UserInfo {
  id: number
  avatar: string
  username: string
  elo: number
  win: number
  lose: number
  onlineStatus: boolean
  tournamentWon: number
  pointScored: number
  pointConcede: number
}

interface Match {
  id: number
  p1Id: number
  p2Id: number
  p1Elo: number
  p2Elo: number
  winnerId: number
  p1Score: number
  p2Score: number
  p1EloGain: number
  p2EloGain: number
  mDate: string
  matchType: string
  player1?: UserInfo
  player2?: UserInfo
}

interface ProfileData {
  userInfo: UserInfo
  matchHistory: Match[]
  isBlocked: boolean
}

export default function ProfilePage() {
  const t = useI18n()
  const params = useParams()
  const username = params.username as string
  const locale = params.locale as string
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
	const fetchProfileData = async () => {
	  try {
		const response = await fetch(`/api/profile/${username}`, {
		  credentials: "include",
		})
		if (!response.ok) {
		  throw new Error(t('profile.errors.fetchFailed'))
		}
		const data = await response.json()
		setProfileData(data)
	  } catch (err) {
		setError(err instanceof Error ? err.message : t('profile.errors.unknown'))
		console.error(t('profile.errors.fetchError'), err)
	  } finally {
		setIsLoading(false)
	  }
	}
	if (username) {
	  fetchProfileData()
	}
  }, [username, t])

  if (isLoading) return <ProfileSkeleton locale={locale} />
  if (error) {
	return (
	  <div className="flex items-center justify-center h-screen">
		<Card className="w-full max-w-md">
		  <CardHeader>
			<CardTitle>{t('common.error')}</CardTitle>
		  </CardHeader>
		  <CardContent>
			<p className="text-red-500">{error}</p>
		  </CardContent>
		  <CardFooter>
			<Link href="/dashboard">
			  <Button variant="outline">{t('profile.returnToDashboard')}</Button>
			</Link>
		  </CardFooter>
		</Card>
	  </div>
	)
  }
  if (!profileData || !profileData.userInfo) {
	return (
	  <div className="flex items-center justify-center h-screen">
		<Card className="w-full max-w-md">
		  <CardHeader>
			<CardTitle>{t('profile.notFound.title')}</CardTitle>
		  </CardHeader>
		  <CardContent>
			<p>{t('profile.notFound.description')}</p>
		  </CardContent>
		  <CardFooter>
			<Link href="/dashboard">
			  <Button variant="outline">{t('profile.returnToDashboard')}</Button>
			</Link>
		  </CardFooter>
		</Card>
	  </div>
	)
  }

  const { userInfo, matchHistory } = profileData
  const winCount = userInfo.win || 0
  const loseCount = userInfo.lose || 0
  const winRate = winCount + loseCount > 0 ? Math.round((winCount / (winCount + loseCount)) * 100) : 0

  const formattedMatches = matchHistory.map((match) => {
	const isPlayer1 = match.p1Id === userInfo.id
	const rawAvatar = isPlayer1 ? match.player2?.avatar : match.player1?.avatar
	const opponentAvatar = rawAvatar
	  ? `data:image/webp;base64,${rawAvatar}`
	  : undefined
	const playerScore = isPlayer1 ? match.p1Score : match.p2Score
	const opponentScore = isPlayer1 ? match.p2Score : match.p1Score
	const eloChange = isPlayer1 ? match.p1EloGain : match.p2EloGain

	return {
	  id: match.id,
	  date: new Date(match.mDate).toLocaleDateString(),
	  opponent: isPlayer1 ? match.player2?.username : match.player1?.username,
	  result: match.winnerId === userInfo.id ? t('profile.match.victory') : t('profile.match.defeat'),
	  score: `${playerScore}-${opponentScore}`,
	  eloChange: `${eloChange > 0 ? '+' : ''}${eloChange}`,
	  opponentAvatar,
	}
  })

  return (
	<div className="bg-background min-h-screen">
	  <Header locale={locale} />
	  <div className="container mx-auto py-8">
		<div className="flex justify-between items-center mb-8">
		  <Link href="/dashboard">
			<Button variant="outline" size="sm" className="flex items-center gap-2">
			  <ArrowLeft className="h-4 w-4" /> {t('profile.returnToDashboard')}
			</Button>
		  </Link>
		  <h1 className="text-2xl font-bold">
			{t('profile.title', { username: userInfo.username })}
		  </h1>
		</div>
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
		  <div className="lg:col-span-4">
			<UserProfileCard user={userInfo} locale={locale} isBlocked={profileData.isBlocked} />
			<Card className="bg-card border shadow-sm mt-6">
			  <CardHeader>
				<CardTitle>{t('profile.stats.title')}</CardTitle>
			  </CardHeader>
			  <CardContent>
				<div className="space-y-4">
				  <div className="flex justify-between">
					<span className="text-muted-foreground">{t('profile.stats.gamesPlayed')}</span>
					<span className="font-medium">{winCount + loseCount}</span>
				  </div>
				  <div className="flex justify-between">
					<span className="text-muted-foreground">{t('profile.stats.winRate')}</span>
					<span className="font-medium">{winRate}%</span>
				  </div>
				  <div className="flex justify-between">
					<span className="text-muted-foreground">{t('profile.stats.pointsScored')}</span>
					<span className="font-medium">{userInfo.pointScored}</span>
				  </div>
				  <div className="flex justify-between">
					<span className="text-muted-foreground">{t('profile.stats.pointsConceded')}</span>
					<span className="font-medium">{userInfo.pointConcede}</span>
				  </div>
				  <div className="flex justify-between">
					<span className="text-muted-foreground">{t('profile.stats.tournamentsWon')}</span>
					<span className="font-medium">{userInfo.tournamentWon}</span>
				  </div>
				</div>
			  </CardContent>
			</Card>
		  </div>
		  <div className="lg:col-span-8">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
			  <TabsList className="grid grid-cols-2 mb-6">
				<TabsTrigger value="overview">{t('profile.tabs.overview')}</TabsTrigger>
				<TabsTrigger value="matches">{t('profile.tabs.matches')}</TabsTrigger>
			  </TabsList>
			  <TabsContent value="overview">
				<Card className="bg-card border shadow-sm mb-6">
				  <CardHeader>
					<CardTitle>{t('profile.elo.title')}</CardTitle>
					<CardDescription>{t('profile.elo.description')}</CardDescription>
				  </CardHeader>
				  <CardContent className="h-64 flex items-center justify-center">
					<div className="text-center text-muted-foreground">
					  {t('profile.elo.chartPlaceholder')}
					</div>
				  </CardContent>
				</Card>
			  </TabsContent>
			  <TabsContent value="matches">
				<Card className="bg-card border shadow-sm">
				  <CardHeader>
					<CardTitle>{t('profile.matches.title')}</CardTitle>
					<CardDescription>
					  {t('profile.matches.description', { username: userInfo.username })}
					</CardDescription>
				  </CardHeader>
				  <CardContent>
					<div className="overflow-x-auto">
					  <table className="w-full">
						<thead>
						  <tr className="border-b">
							<th className="text-left py-3 px-4 font-medium">{t('profile.matches.date')}</th>
							<th className="text-left py-3 px-4 font-medium">{t('profile.matches.opponent')}</th>
							<th className="text-left py-3 px-4 font-medium">{t('profile.matches.result')}</th>
							<th className="text-left py-3 px-4 font-medium">{t('profile.matches.score')}</th>
							<th className="text-right py-3 px-4 font-medium">{t('profile.matches.eloChange')}</th>
						  </tr>
						</thead>
						<tbody>
						  {formattedMatches.map((match) => (
							<tr key={match.id} className="border-b">
							  <td className="py-3 px-4 text-muted-foreground">{match.date}</td>
							  <td className="py-3 px-4">
								<div className="flex items-center">
								  <Avatar className="h-6 w-6 mr-2">
									{match.opponentAvatar
									  ? <AvatarImage src={match.opponentAvatar} alt={`${match.opponent} avatar`} />
									  : <AvatarFallback>{match.opponent?.charAt(0)}</AvatarFallback>
									}
								  </Avatar>
								  <span className="hover:underline">{match.opponent}</span>
								</div>
							  </td>
							  <td className="py-3 px-4">
								<Badge
								  className={
									match.result === t('profile.match.victory')
									  ? "bg-green-500/20 text-green-500"
									  : "bg-red-500/20 text-red-500"
								  }
								>
								  {match.result}
								</Badge>
							  </td>
							  <td className="py-3 px-4">{match.score}</td>
							  <td className={`py-3 px-4 text-right font-medium ${match.eloChange.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
								{match.eloChange}
							  </td>
							</tr>
						  ))}
						</tbody>
					  </table>
					</div>
				  </CardContent>
				</Card>
			  </TabsContent>
			</Tabs>
		  </div>
		</div>
	  </div>
	</div>
  )
}
