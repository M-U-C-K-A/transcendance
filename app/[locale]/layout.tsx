// app/[lang]/layout.tsx
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import {ThemePersistence} from '@/components/theme-persistence'
import { Provider } from './provider'
// Load font outside component
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap'
})

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };

}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider locale={params.locale}>
      <ThemePersistence lang={params.locale} />
      {children}
      </Provider>
    </ThemeProvider>
  )
}

