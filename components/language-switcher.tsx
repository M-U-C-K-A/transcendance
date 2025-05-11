"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Globe, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { locales, type Locale } from "@/i18n-config" // Importez le type Locale

// Typage fort pour les données de langue
interface LanguageData {
  name: string
  flag: string
}

const languageData: Record<Locale, LanguageData> = {
  en: { name: "English", flag: "🇬🇧" },
  fr: { name: "Français", flag: "🇫🇷" },
  es: { name: "Español", flag: "🇪🇸" },
  ru: { name: "Русский", flag: "🇷🇺" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  ch: { name: "中文", flag: "🇨🇳" }, // Correction: "Chinois" au lieu de "Chinesse"
  na: { name: "Na'vi", flag: "🌌" },
  id: { name: "Bahasa Indonesia", flag: "🇮🇩" }, // Correction: Drapeau indonésien
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLang = pathname.split('/')[1] as Locale

  const switchLanguage = (newLocale: Locale) => {
    if (!locales.includes(newLocale)) return

    // Construction du nouveau chemin
    const segments = pathname.split('/')
    segments[1] = newLocale // Remplace la locale actuelle
    const newPath = segments.join('/')

    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{languageData[currentLang]?.name}</span>
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
            <span className="mr-1">{languageData[locale]?.flag}</span>
            {languageData[locale]?.name}
            {locale === currentLang && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
