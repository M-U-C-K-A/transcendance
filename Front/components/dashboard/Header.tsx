'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Activity, Shield, LogOut, LogIn, User } from "lucide-react"
import { ThemeToggle } from "@/components/setting/theme-toggle"
import { LanguageSwitcher } from "@/components/setting/language-switcher"
import { useI18n } from "@/i18n-client"
import { ProfileEditDialog } from "../setting/profile-edit-dialog"
import { hasCookie, deleteCookie } from "cookies-next"

interface HeaderProps {
	locale: string
}

export function Header({ locale }: HeaderProps) {
	const t = useI18n()
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		setIsAuthenticated(hasCookie("token"))
	}, [])

	const handleLogout = () => {
		deleteCookie("token")
		window.location.href = "/auth"
	}

	return (
		<header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
			<div className="container mx-auto py-4 flex justify-between items-center">
				<Link
					href={`/dashboard`}
					className="items-center gap-2 hidden md:flex"
					aria-label={`${t("common.appName")} - ${t("nav.home")}`}
				>
					<Activity className="h-6 w-6 text-primary" aria-hidden="true" />
					<h1 className="text-xl font-bold">
						{t("common.appName")}
						<span className="sr-only"> - {t("nav.home")}</span>
					</h1>
				</Link>

				<nav className="flex items-center gap-4 w-full justify-center md:justify-end">
					<Button asChild variant="ghost" size="sm">
						<Link href="/GDPR">
							<Shield className="h-5 w-5" aria-hidden="true" />
							<span className="sr-only">GDPR</span>
						</Link>
					</Button>

					{/* Seulement si connecté */}
					{isAuthenticated && <ProfileEditDialog />}

					<LanguageSwitcher />
					<ThemeToggle />

					{isAuthenticated ? (
						<Button variant="ghost" size="sm" onClick={handleLogout}>
							<LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
							{t('nav.signOut') || "Logout"}
						</Button>
					) : (
						<Button asChild variant="ghost" size="sm">
							<Link href="/auth">
								<LogIn className="h-5 w-5 mr-2" aria-hidden="true" />
								{t('nav.signIn') || "Sign in"}
							</Link>
						</Button>
					)}
				</nav>
			</div>
		</header>
	)
}
