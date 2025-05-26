// components/theme-handler.tsx
"use client"

import { ThemeProvider } from "next-themes"
import React from "react"
import { useEffect, useState } from "react"

/**
 * @param {React.ReactNode} children The children to render.
 * @param {React.ElementType} element The element to render the children in.
 * @param {object} [props] Additional props to pass to the element.
 */
export function ThemeHandler({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return <>{children}</>
	}

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</ThemeProvider>
	)
}
