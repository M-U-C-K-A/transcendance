"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * A button to toggle the theme between light and dark.
 *
 * If the component is not yet mounted, it renders a light theme icon.
 * If the component is mounted, it renders either a light theme icon or a dark theme
 * icon, depending on the current theme. The button toggles the theme between light
 * and dark when clicked.
 *
 * @returns A button to toggle the theme.
 */
export function ThemeToggle() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<Button
				variant="ghost"
				size="icon"
				aria-label="Toggle theme"
			>
				<Sun className="h-5 w-5" />
			</Button>
		)
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			aria-label="Toggle theme"
		>
			{theme === "dark" ? (
				<Moon className="h-5 w-5" />
			) : (
				<Sun className="h-5 w-5" />
			)}
		</Button>
	)
}
