"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Globe, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Liste manuelle des langues supportées
const locales = ["en", "fr"] as const
type Locale = (typeof locales)[number]

const languageData: Record<Locale, { name: string; flag: string }> = {
  en: { name: "English", flag: "🇬🇧" },
  fr: { name: "Français", flag: "🇫🇷" },
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()

  if (!pathname) return null

  const pathSegments = pathname.split("/")
  const currentLang = pathSegments[1] as Locale

  const switchLanguage = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) return

    const newPathSegments = [...pathSegments]
    newPathSegments[1] = newLocale
    const newPath = newPathSegments.join("/")

    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">
            {languageData[currentLang]?.name ?? currentLang}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className="flex items-center gap-2"
            onClick={() => switchLanguage(locale)}
            disabled={locale === currentLang}
          >
            <span className="mr-1">{languageData[locale].flag}</span>
            {languageData[locale].name}
            {locale === currentLang && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
