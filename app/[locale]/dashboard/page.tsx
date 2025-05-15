// app/[locale]/dashboard/page.tsx
import DashboardClient from './dashboard-client'

export default async function DashboardPage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = await Promise.resolve(params)
  return <DashboardClient locale={locale} />
}
