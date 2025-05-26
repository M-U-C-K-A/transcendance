"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * A convenience wrapper around {@link https://next-themes.vercel.app/docs/api/theme-provider `next-themes`}'s `ThemeProvider` component.
 *
 * @remarks
 *
 * This component is a drop-in replacement for `next-themes`'s `ThemeProvider` component. It
 * provides the same API surface, and delegates the rendering of the theme provider to
 * `next-themes`'s `ThemeProvider` component.
 *
 * @example
 **/
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
