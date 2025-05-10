import { getDictionary } from "@/lib/dictionary"
import type { Locale } from "@/middleware"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return <DashboardClient dict={dict} lang={lang} />
}
