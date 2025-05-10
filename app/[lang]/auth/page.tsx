import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/middleware"
import AuthClient from "./auth-client"

export default async function AuthPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale }
  searchParams: { register?: string }
}) {
  const dict = await getDictionary(lang)
  const isRegister = searchParams.register === "true"

  return <AuthClient dict={dict} isRegister={isRegister} lang={lang} />
}
