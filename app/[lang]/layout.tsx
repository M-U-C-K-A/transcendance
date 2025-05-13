// app/[lang]/layout.tsx
import { ThemeProvider } from '@/components/theme-provider'
import { Inter } from 'next/font/google'
import {ThemePersistence} from '@/components/theme-persistence'

// Load font outside component
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap'
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { lang } = await params

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemePersistence lang={lang} />
      {children}
    </ThemeProvider>
  )
}

