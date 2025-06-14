// components/theme-persistence.tsx
"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

/**
 * Sets the document language and theme based on the locale and resolved theme.
 * This ensures that the page is styled correctly and that the correct language
 * is set for accessibility purposes.
 *
 * @param {Object} props
 * @prop {string} lang - The locale to set the document language to.
 */
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
