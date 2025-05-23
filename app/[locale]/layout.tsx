import { ThemeProvider } from '@/components/theme-provider'
import { ThemePersistence } from '@/components/theme-persistence'
import { Provider } from './provider'


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
