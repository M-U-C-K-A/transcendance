import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart, MessageCircle, Activity } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/middleware"

export default async function LandingPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">{dict.common.appName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href={`/${lang}/stats`}>
              <Button variant="ghost" size="sm">
                {dict.common.statistics}
              </Button>
            </Link>
            <Link href={`/${lang}/auth`}>
              <Button variant="outline" size="sm">
                {dict.common.login}
              </Button>
            </Link>
            <Link href={`/${lang}/auth?register=true`}>
              <Button size="sm">{dict.common.register}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">{dict.landing.hero.title}</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">{dict.landing.hero.subtitle}</p>
        <Link href={`/${lang}/auth?register=true`}>
          <Button size="lg" className="text-lg px-8 py-6">
            {dict.landing.hero.cta} <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto py-20">
        <h2 className="text-3xl font-bold text-center mb-16">{dict.landing.features.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-card p-8 rounded-lg text-center shadow-sm">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{dict.landing.features.gameModes.title}</h3>
            <p className="text-muted-foreground">{dict.landing.features.gameModes.description}</p>
          </div>
          <div className="bg-card p-8 rounded-lg text-center shadow-sm">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{dict.landing.features.chat.title}</h3>
            <p className="text-muted-foreground">{dict.landing.features.chat.description}</p>
          </div>
          <div className="bg-card p-8 rounded-lg text-center shadow-sm">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{dict.landing.features.elo.title}</h3>
            <p className="text-muted-foreground">{dict.landing.features.elo.description}</p>
          </div>
        </div>
      </section>

      {/* Game Preview */}
      <section className="container mx-auto py-20">
        <div className="bg-card p-4 rounded-lg shadow-sm overflow-hidden">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="w-full max-w-3xl h-full max-h-80 relative">
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="w-[1px] h-full bg-border"></div>
              </div>
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-2 h-16 bg-foreground rounded"></div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-2 h-16 bg-foreground rounded"></div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">{dict.landing.cta.title}</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">{dict.landing.cta.subtitle}</p>
        <div className="flex gap-4 justify-center">
          <Link href={`/${lang}/auth`}>
            <Button variant="outline" size="lg">
              {dict.common.login}
            </Button>
          </Link>
          <Link href={`/${lang}/auth?register=true`}>
            <Button size="lg">{dict.common.freeRegister}</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>{dict.common.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
