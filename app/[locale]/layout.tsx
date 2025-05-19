import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemePersistence } from '@/components/theme-persistence'
import { Provider } from './provider'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap'
})

// ✅ Important : rendre la fonction async pour await `params`
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // ✅ Extra sécuritaire : forcer l'attente si c'est une proxy object
  const { locale } = await Promise.resolve(params)

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider locale={locale}>
            <ThemePersistence lang={locale} />
            {children}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
