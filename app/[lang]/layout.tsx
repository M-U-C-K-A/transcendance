import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { locales } from "@/middleware"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  title: "PongMaster - Le jeu de Pong professionnel",
  description: "Jouez au Pong, participez à des tournois et suivez votre progression ELO",
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: string }
}>) {
  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
