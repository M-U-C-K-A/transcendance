import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "../globals.css"
import { ThemeProvider } from "next-themes"
import { ThemePersistence } from "@/components/theme-persistence"
import { Locale } from '@/i18n-config';
import { getDictionary } from "@/lib/dictionaries"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale } // Utilisez le type Locale au lieu de string
}) {
  // Supprimez async car ce composant n'a pas besoin d'être asynchrone
  const { lang } = params

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemePersistence lang={lang} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
