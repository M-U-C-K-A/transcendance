import { useEffect, useState } from "react"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	CartesianGrid,
	Legend,
	LineChart,
	Line,
	PieChart,
	Pie,
	PolarAngleAxis,
	PolarGrid,
	PolarRadiusAxis,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	Cell,
} from "recharts"
import { UserSelect } from "./UserSelect"

interface UserStats {
	basicStats: {
		elo: number
		winRate: number
		totalMatches: number
		tournamentWins: number
	}
	eloHistory: {
		date: string
		elo: number
		eloGain: number
	}[]
	matchTypes: {
		matchType: string
		_count: number
	}[]
	tournamentStats: {
		wins: number
		participation: number
		winRate: number
	}
	matchTypeStats: {
		matchType: string
		_count: number
	}[]
}

interface GlobalStats {
	topPlayers: {
		id: number
		username: string
		elo: number
		win: number
	}[]
	matchTypeStats: {
		matchType: string
		_count: number
	}[]
	tournamentStats: {
		tDate: string
		_count: number
	}[]
	eloDistribution: {
		range: string
		count: number
	}[]
	weeklyActivity: {
		day: string
		activity: number
	}[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

/**
 * Displays user and global statistics using various chart types.
 *
 * @param {number} selectedUserId The ID of the user to display statistics for.
 * @returns {JSX.Element} A section containing interactive statistics charts.
 */
export function GraphSection(selectedUserId: number) {
	//const t = useI18n()
	const [userStats, setUserStats] = useState<UserStats | null>(null)
	const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true)
				setError(null)
				const [userResponse, globalResponse] = await Promise.all([
					fetch(`https://localhost:3001/stats/user/${selectedUserId}`),
					fetch("https://localhost:3001/stats/global"),
				])

				if (!userResponse.ok || !globalResponse.ok) {
					throw new Error("Erreur lors de la récupération des statistiques")
				}

				const [userData, globalData] = await Promise.all([
					userResponse.json(),
					globalResponse.json(),
				])

				setUserStats(userData)
				setGlobalStats(globalData)
			} catch (err) {
				setError(err instanceof Error ? err.message : "Une erreur est survenue")
			} finally {
				setLoading(false)
			}
		}
		fetchStats()
	}, [selectedUserId])

	if (loading) {
		return <div className="text-center py-10">Chargement des statistiques...</div>
	}

	if (error) {
		return <div className="text-center py-10 text-red-600">Erreur: {error}</div>
	}

	return (
		<div className="space-y-8">
			<header className="flex justify-between items-center">
				<h2 className="text-3xl font-bold tracking-tight">Statistiques</h2>
				<UserSelect selectedUserId={selectedUserId} onUserSelect={setSelectedUserId} />
			</header>

			<Tabs defaultValue="user" className="w-full">
				<TabsList className="grid grid-cols-2 mb-8">
					<TabsTrigger value="user">Statistiques personnelles</TabsTrigger>
					<TabsTrigger value="global">Statistiques globales</TabsTrigger>
				</TabsList>

				{/* --- Statistiques Utilisateur --- */}
				<TabsContent value="user">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Évolution ELO */}
						<Card>
							<CardHeader>
								<CardTitle>Évolution de l&apos;ELO</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={userStats?.eloHistory || []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Area
											type="monotone"
											dataKey="elo"
											stroke="#8884d8"
											fill="#8884d8"
											name="ELO"
										/>
										<Area
											type="monotone"
											dataKey="eloGain"
											stroke="#82ca9d"
											fill="#82ca9d"
											name="Gain ELO"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Répartition des types de matchs */}
						<Card>
							<CardHeader>
								<CardTitle>Répartition des matchs</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={userStats?.matchTypes || []}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={100}
											fill="#8884d8"
											dataKey="_count"
											nameKey="matchType"
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{(userStats?.matchTypes || []).map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Statistiques générales */}
						<Card>
							<CardHeader>
								<CardTitle>Statistiques générales</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-6 text-center">
									<div>
										<p className="text-3xl font-bold text-primary">
											{userStats?.basicStats.winRate.toFixed(1)}%
										</p>
										<p className="text-sm text-muted-foreground">Taux de victoire</p>
									</div>
									<div>
										<p className="text-3xl font-bold text-primary">
											{userStats?.basicStats.elo}
										</p>
										<p className="text-sm text-muted-foreground">ELO actuel</p>
									</div>
									<div>
										<p className="text-3xl font-bold text-primary">
											{userStats?.basicStats.totalMatches}
										</p>
										<p className="text-sm text-muted-foreground">Matchs joués</p>
									</div>
									<div>
										<p className="text-3xl font-bold text-primary">
											{userStats?.basicStats.tournamentWins}
										</p>
										<p className="text-sm text-muted-foreground">Tournois gagnés</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Performance tournois (Radar) */}
						<Card>
							<CardHeader>
								<CardTitle>Performance en tournois</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<RadarChart
										data={[
											{
												subject: "Victoires",
												A: userStats?.tournamentStats.wins ?? 0,
												fullMark: userStats?.tournamentStats.participation ?? 1,
											},
											{
												subject: "Participations",
												A: userStats?.tournamentStats.participation ?? 0,
												fullMark: userStats?.tournamentStats.participation ?? 1,
											},
											{
												subject: "Taux de victoire (%)",
												A: userStats?.tournamentStats.winRate ?? 0,
												fullMark: 100,
											},
										]}
									>
										<PolarGrid />
										<PolarAngleAxis dataKey="subject" />
										<PolarRadiusAxis angle={30} domain={[0, 100]} />
										<Radar
											name="Performance"
											dataKey="A"
											stroke="#8884d8"
											fill="#8884d8"
											fillOpacity={0.6}
										/>
										<Legend />
									</RadarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Matchs par type (BarChart) */}
						<Card>
							<CardHeader>
								<CardTitle>Nombre de matchs par type</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={userStats?.matchTypeStats || []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="matchType" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey="_count" fill="#8884d8" name="Nombre de matchs" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Historique des scores (LineChart) */}
						<Card>
							<CardHeader>
								<CardTitle>Historique des scores</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={userStats?.eloHistory || []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="date" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Line
											type="monotone"
											dataKey="elo"
											stroke="#8884d8"
											name="Score"
										/>
									</LineChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* --- Statistiques Globales --- */}
				<TabsContent value="global">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Top joueurs (BarChart) */}
						<Card>
							<CardHeader>
								<CardTitle>Top 10 des joueurs</CardTitle>
							</CardHeader>
							<CardContent className="h-[400px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={globalStats?.topPlayers || []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="username" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey="elo" fill="#8884d8" name="ELO" />
										<Bar dataKey="win" fill="#82ca9d" name="Victoires" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Répartition des types de matchs (PieChart) */}
						<Card>
							<CardHeader>
								<CardTitle>Répartition des types de matchs</CardTitle>
							</CardHeader>
							<CardContent className="h-[400px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={globalStats?.matchTypeStats || []}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={150}
											fill="#8884d8"
											dataKey="_count"
											nameKey="matchType"
											label={({ name, percent }) =>
												`${name} ${(percent * 100).toFixed(0)}%`
											}
										>
											{(globalStats?.matchTypeStats || []).map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Évolution des tournois (AreaChart) */}
						<Card className="md:col-span-2">
							<CardHeader>
								<CardTitle>Évolution des tournois</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={globalStats?.tournamentStats || []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="tDate" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Area
											type="monotone"
											dataKey="_count"
											stroke="#8884d8"
											fill="#8884d8"
											name="Nombre de tournois"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Distribution des ELO (BarChart) */}
						<Card>
							<CardHeader>
								<CardTitle>Distribution des ELO</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={globalStats?.eloDistribution || []}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="range" />
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar dataKey="count" fill="#8884d8" name="Nombre de joueurs" />
									</BarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Activité par jour (RadarChart) */}
						<Card>
							<CardHeader>
								<CardTitle>Activité par jour de la semaine</CardTitle>
							</CardHeader>
							<CardContent className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<RadarChart data={globalStats?.weeklyActivity || []}>
										<PolarGrid />
										<PolarAngleAxis dataKey="day" />
										<PolarRadiusAxis angle={30} domain={[0, 100]} />
										<Radar
											name="Activité"
											dataKey="activity"
											stroke="#8884d8"
											fill="#8884d8"
											fillOpacity={0.6}
										/>
										<Legend />
										<Tooltip />
									</RadarChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
