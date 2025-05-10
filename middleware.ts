import { type NextRequest, NextResponse } from "next/server"

export type Locale = "en" | "fr" | "es" | "ru" | "de"

// Liste des locales supportées
export const locales: Locale[] = ["en", "fr", "es", "ru", "de"]

// Locale par défaut
export const defaultLocale: Locale = "en"

// Fonction pour obtenir la locale préférée de l'utilisateur
function getLocale(request: NextRequest): Locale {
  // Vérifier si une locale est déjà dans le chemin
  const pathname = request.nextUrl.pathname
  const pathnameLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameLocale) return pathnameLocale

  // Vérifier les locales préférées dans l'en-tête Accept-Language
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const acceptedLocales = acceptLanguage.split(",").map((locale) => locale.split(";")[0].trim().substring(0, 2))

    const matchedLocale = acceptedLocales.find((locale) => locales.includes(locale as Locale)) as Locale | undefined

    if (matchedLocale) return matchedLocale
  }

  // Retourner la locale par défaut
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Ignorer les requêtes pour les fichiers statiques
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // Vérifier si le chemin a déjà une locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return NextResponse.next()

  // Rediriger vers le chemin avec la locale
  const locale = getLocale(request)
  const newUrl = new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)

  // Conserver les paramètres de recherche
  if (request.nextUrl.search) {
    newUrl.search = request.nextUrl.search
  }

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
}
