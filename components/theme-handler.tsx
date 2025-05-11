// components/theme-handler.tsx
"use client"

import { ThemeProvider } from "next-themes"
import React from "react"
import { useEffect, useState } from "react"

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
