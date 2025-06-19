// app/error.tsx
"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold">Une erreur est survenue</h1>
        <p className="text-lg text-muted-foreground">
          {error.message}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>
            Réessayer
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              Retour au dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
