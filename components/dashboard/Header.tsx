import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, BarChart, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/i18n-client"

interface HeaderProps {
  locale: string
  user: string
}

export function Header({ locale, user }: HeaderProps) {
  const t = useI18n()
  const displayUser = user || "NONE"

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Link href={`/`} className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">{t('common.appName')}</h1>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          <Link href="/stats">
            <Button variant="ghost" size="sm" aria-label="Stats">
              <BarChart className="h-5 w-5" />
            </Button>
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href={`/${locale}`}>
            <Button variant="ghost" size="sm" aria-label="Log Out">
              <LogOut className="h-5 w-5" />
            </Button>
          </Link>
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${displayUser}`} width={32} height={32} alt={displayUser} />
            <AvatarFallback>{displayUser.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

