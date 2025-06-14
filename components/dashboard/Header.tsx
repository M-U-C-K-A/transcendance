import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, Shield, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/i18n-client"
import { LogIn } from "lucide-react"
import { useUsernameFromJWT } from "@/hooks/use-username-from-jwt"
import { ProfileEditDialog } from "../profile-edit-dialog"
import { useIdFromJWT } from "@/hooks/use-id-from-jwt"

interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const username = useUsernameFromJWT() || ''
  const id = useIdFromJWT() || ''
  const t = useI18n()
  const isLoggedIn = Boolean(username)

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token")
      window.location.href = `/${locale}/auth`
    }
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Link href={`/`} className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">{t('common.appName')}</h1>
        </Link>
        <div className="flex items-center gap-4">
          {/* Bouton GDPR toujours visible */}
          <Link href="/GDPR">
            <Button variant="ghost" size="sm" aria-label="GDPR">
              <Shield className="h-5 w-5" />
            </Button>
          </Link>

          {isLoggedIn && <ProfileEditDialog />}

          <LanguageSwitcher />
          <ThemeToggle />

          {isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Log Out"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" /> Log Out
              </Button>
              <Avatar>
                <AvatarImage
                  src={`/profilepicture/${id}.webp`}
                  width={32}
                  height={32}
                  alt={username}
                />
                <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <Link href={`/auth?redirect=${locale}`}>
              <Button variant="ghost" size="sm" aria-label="Sign In">
                <LogIn className="h-5 w-5" /> Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
