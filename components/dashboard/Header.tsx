
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, BarChart, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/i18n-client"
import { LogIn } from "lucide-react"
import { useJWT } from "@/hooks/use-jwt"

interface HeaderProps {
	locale: string
	user: string | null
}

export function Header({ user: jwtToken, locale }: { user: string, locale: string }) {
	const jwt = useJWT()
	const t = useI18n()
	const [user, setUser] = useState<HeaderProps | null>(null)
	console.log("JWT:", jwt)
	const isLoggedIn = jwt ? true : false
	const displayName = jwt ? jwtToken : null

	return (
		<header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
			<div className="container mx-auto py-4 flex justify-between items-center">
				<Link href={`/`} className="flex items-center gap-2">
					<Activity className="h-6 w-6 text-primary" />
					<h1 className="text-xl font-bold">{t('common.appName')}</h1>
				</Link>
				<div className="flex items-center gap-4">

					{isLoggedIn ? (
						<>
							<Button variant="ghost" size="sm" aria-label="Settings" disabled={!isLoggedIn}>
								<Settings className="h-5 w-5" />
							</Button>
							<Link href="/stats">
								<Button variant="ghost" size="sm" aria-label="Stats">
									<BarChart className="h-5 w-5" />
								</Button>
							</Link>
						</>
					) : (
						<>

							<Button variant="ghost" size="sm" aria-label="Settings" disabled>
								<Settings className="h-5 w-5" />
							</Button>
							<Button variant="ghost" size="sm" aria-label="Stats" disabled>
								<BarChart className="h-5 w-5" />
							</Button>
						</>
					)}
					<LanguageSwitcher />
					<ThemeToggle />
					{isLoggedIn ? (
						<>
							<Link href={`/${locale}`}>
								<Button variant="ghost" size="sm" aria-label="Log Out">
									<LogOut className="h-5 w-5" /> Log Out
								</Button>
							</Link>
							<Avatar>
								<AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${displayName}`} width={32} height={32} alt={displayName} />
								<AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
							</Avatar>
						</>
					) : (

						<Link href={`/auth?redirect=${locale}`}>
							<Button variant="ghost" size="sm" aria-label="Log Out">
								<LogIn className="h-5 w-5" /> Sign in
							</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	)
}


