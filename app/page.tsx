import { redirect } from "next/navigation"
import { defaultLocale } from "@/middleware"

// Rediriger la page racine vers la locale par défaut
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
