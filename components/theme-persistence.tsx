// components/theme-persistence.tsx
"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemePersistence({ lang }: { lang: string }) {
  const { theme, systemTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    // Applique le thème actuel au html parent
    const html = document.documentElement
    if (resolvedTheme) {
      html.className = resolvedTheme
      html.style.colorScheme = resolvedTheme
    }
    html.lang = lang // Force la langue
  }, [lang, resolvedTheme])

  return null
}
