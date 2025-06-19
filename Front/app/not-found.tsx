// app/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold">404 - Page non trouvée</h1>
        <p className="text-lg text-muted-foreground">
          Oops ! La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Retour au tableau de bord
          </Link>
        </Button>
      </div>
    </div>
  )
}
