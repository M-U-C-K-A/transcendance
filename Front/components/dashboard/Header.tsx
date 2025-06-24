import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity, Shield, LogOut, LogIn } from "lucide-react"
import { ThemeToggle } from "@/components/setting/theme-toggle"
import { LanguageSwitcher } from "@/components/setting/language-switcher"
import { useI18n } from "@/i18n-client"
import { ProfileEditDialog } from "../setting/profile-edit-dialog"

interface HeaderProps {
	locale: string
}

export function Header({ locale }: HeaderProps) {
	const t = useI18n()

	const handleLogout = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem("token")
			window.location.href = `/auth`
		}
	}

	return (
		<header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
			<div className="container mx-auto py-4 flex justify-between items-center">
				{/* App Logo/Link - Clear purpose from text */}
				<Link
					href={`/dashboard`}
					className="items-center gap-2 hidden md:flex"
					aria-label={`${t('common.appName')} - ${t('nav.home')}`}
				>
					<Activity className="h-6 w-6 text-primary" aria-hidden="true" />
					<h1 className="text-xl font-bold">
						{t('common.appName')}
						<span className="sr-only"> - {t('nav.home')}</span>
					</h1>
				</Link>

				<nav aria-label="Primary navigation" className="flex items-center gap-4 w-full justify-center md:justify-end">
					{/* GDPR Button - Clear purpose from visible text */}
					<Link href="/GDPR" passHref legacyBehavior>
						<Button
							asChild
							variant="ghost"
							size="sm"
						>
							<a>
								<Shield className="h-5 w-5 mr-2" aria-hidden="true" />
								<span className="sr-only"> gdpr</span>
							</a>
						</Button>
					</Link>

					{/* These components should handle their own accessibility */}
					<ProfileEditDialog />
					<LanguageSwitcher />
					<ThemeToggle />

					{/* Sign In Button - Clear purpose from visible text */}
					<Link href={`/auth`}>
						<Button
							asChild
							variant="ghost"
							size="sm"
						>
							<a>
								<LogIn className="h-5 w-5 mr-2" aria-hidden="true" />
								{t('nav.signIn') || "Sign in"}
							</a>
						</Button>
					</Link>
				</nav>
			</div>
		</header>
	)
}
