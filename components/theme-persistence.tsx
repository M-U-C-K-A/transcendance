// components/theme-persistence.tsx
"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemePersistence({ lang }: { lang: string }) {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const html = document.documentElement
    if (resolvedTheme) {
      html.setAttribute('class', resolvedTheme)
      html.setAttribute('style', `color-scheme: ${resolvedTheme}`)
    }
    html.setAttribute('lang', lang)
  }, [lang, resolvedTheme])

  return null
}
