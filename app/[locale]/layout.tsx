import { ThemeProvider } from '@/components/setting/theme-provider'
import { ThemePersistence } from '@/components/setting/theme-persistence'
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
        ><script
        crossOrigin="anonymous"
        src="//unpkg.com/react-scan/dist/auto.global.js"
      />
          <Provider locale={locale}>
            <ThemePersistence lang={locale} />
            {children}
          </Provider>
        </ThemeProvider>
  )
}
