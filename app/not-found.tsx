"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

export default function NotFound() {
  const params = useParams()
  const locale = params?.locale as string || 'fr'

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Page non trouvée
        </h2>
        <p className="text-muted-foreground">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block mt-6 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
} 
