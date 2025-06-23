import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UserProfileCardProps {
	user: UserInfo
	locale?: string
	isBlocked?: boolean
}

export function UserProfileCard({ user, isBlocked }: UserProfileCardProps) {
	const [blocked, setBlocked] = useState(!!isBlocked)
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);
	};

	const handleBlock = async () => {
		setLoading(true);
		setError("");

		try {
			const res = await fetch("/api/chat/block", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ id: user.id }),
			});

			if (!res.ok) {
				const errorMsg = await res.text();
				throw new Error(errorMsg || "Échec du blocage");
			}
			setBlocked(true);
		} catch (err: unknown) {
			console.error("Erreur blocage:", err);
			setError(
				err instanceof Error
					? err.message
					: "Impossible de bloquer l'utilisateur."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="bg-card border shadow-sm">
			<CardHeader>
				<CardTitle>Profil</CardTitle>
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

				{/* Statistiques de l'utilisateur */}
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

				{/* Badges */}
				<div className="flex flex-wrap justify-center gap-2 mb-6">
					<Badge className="bg-primary/20 text-primary">ELO: {user.elo}</Badge>
				</div>

				{/* Bouton de blocage/déblocage */}
				<Button
					variant={blocked ? "default" : "destructive"}
					onClick={handleBlock}
					disabled={loading}
					className={`w-40 max-w-xs ${blocked ? "bg-green-500 hover:bg-green-600" : ""}`}
				>
					{loading
						? blocked
							? "Déblocage en cours..."
							: "Blocage en cours..."
						: blocked
							? "Débloquer l'utilisateur"
							: "Bloquer l'utilisateur"}
				</Button>

				{/* Affichage des erreurs */}
				{error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
			</CardContent>
		</Card>
	);
}
