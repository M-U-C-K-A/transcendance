import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
  } from "@/components/ui/card";
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
  import { Badge } from "@/components/ui/badge";

  interface UserProfileCardProps {
	user: UserInfo;
	locale?: string; // Optionnel selon votre besoin
  }

  export function UserProfileCard({ user, locale }: UserProfileCardProps) {
	const getInitials = (name: string) => {
	  return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.substring(0, 2);
	};

	return (
	  <Card className="bg-card border shadow-sm">
		<CardHeader>
		  <CardTitle>Profil</CardTitle>
		</CardHeader>
		<CardContent className="flex flex-col items-center">
		  <Avatar className="h-24 w-24 mb-4">
			<AvatarImage src={user.avatar || "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=JD"} />
			<AvatarFallback className="text-2xl">
			  {getInitials(user.username)}
			</AvatarFallback>
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
			<Badge className={`${user.onlineStatus ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
			  {user.onlineStatus ? 'En ligne' : 'Hors ligne'}
			</Badge>
		  </div>
		</CardContent>
	  </Card>
	);
  }
