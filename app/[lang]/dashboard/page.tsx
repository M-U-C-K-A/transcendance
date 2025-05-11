import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/i18n-config"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return <DashboardClient dict={dict} lang={lang} />
}
