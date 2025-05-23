import { ThemeProvider } from '@/components/theme-provider'
import { ThemePersistence } from '@/components/theme-persistence'
import { Provider } from './provider'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

// ✅ Important : rendre la fonction async pour await `params`
export default async function RootLayout({
  children,
  params,
}: LayoutProps) {
  // ✅ Extra sécuritaire : forcer l'attente si c'est une proxy object
  const { locale } = await params

  return (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Provider locale={locale}>
            <ThemePersistence lang={locale} />
            {children}
          </Provider>
        </ThemeProvider>
  )
}
