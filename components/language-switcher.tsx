"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Globe, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { locales } from "@/middleware"

// Noms des langues
const languageNames: Record<string, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ru: "Русский",
  de: "Deutsch",
  ch: "Chinesse",
  na: "Na'vi",
  id: "Indien",
}

// Drapeaux des langues (codes emoji)
const languageFlags: Record<string, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸",
  ru: "🇷🇺",
  de: "🇩🇪",
  ch: "🇨🇳",
  na: "🌌",
  id: "🇮🇳",
}

export function LanguageSwitcher() {
  const router = useRouter()
  const params = useParams()
  const currentLang = params.lang as string
  const [open, setOpen] = useState(false)

  const switchLanguage = (locale: string) => {
    // Récupérer le chemin actuel sans la locale
    const path = window.location.pathname
    const newPath = path.replace(`/${currentLang}`, `/${locale}`)

    // Rediriger vers la nouvelle URL
    router.push(newPath)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{languageNames[currentLang]}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} className="flex items-center gap-2" onClick={() => switchLanguage(locale)}>
            <span className="mr-1">{languageFlags[locale]}</span>
            {languageNames[locale]}
            {locale === currentLang && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
